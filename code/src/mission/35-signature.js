  /* =========================================================
     SIGNATURE PLANETS (mission pages only)
     A few missions get a one-off planet drawn from their own project's visual language instead of the generated
     surface: Topicweave = the v3 loom's globe of threads (cks-v3 js/loom.js F.sphere), 510 Visuals = the site's dotted continent
     globe, see-through, with its graticule, HQ pins and its arcs drawn as thin rings (vendor/510-globe.js).
     They replace that mission's planet where it shows on a mission page (hero, manifest status card, tools-in-orbit
     center, next-mission card) and nowhere else: the Work board, Home and Services keep the CMS planet, and these never join the random
     planet pool. The core planet is still built underneath (drag, magnet and hover keep working on .ab_planet);
     its sphere + rings are hidden and a canvas draws on top, animated only while on screen, one still frame under
     reduced motion.
     ========================================================= */
  (function(){
    var SIG = {};

    /* ---- Topicweave: a globe of threads ---- */
    SIG.topicweave = (function(){
      var COL = ['#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff', '#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff', '#e9e6df'];
      var TAU = Math.PI * 2;
      function rnd(n){ var s = 7, a = []; for (var i = 0; i < n; i++){ s = (s * 16807) % 2147483647; a.push((s - 1) / 2147483646); } return a; }
      return function(R){
        // R = planet radius in px: only the globe (Angelino 2026-10-04: no bands or spokes around it)
        var small = R < 26, N = small ? 120 : R < 70 ? 300 : 700, rr = rnd(N * 3);
        return { pad: 1.12, draw: function(ctx, cx, cy, t){
          var len = Math.max(2.2, R * (small ? .2 : R < 70 ? .09 : .07)), lw = Math.max(1, Math.min(1.6, R / 70));
          ctx.lineCap = 'round'; ctx.lineWidth = lw;
          for (var i = 0; i < N; i++){
            var R1 = rr[i * 3], R2 = rr[i * 3 + 1], R3 = rr[i * 3 + 2];
            // a point on the sphere, turning, tilted toward us; the thread lies along its latitude, back threads faint
            var lat = Math.acos(2 * R1 - 1), lon = R2 * TAU + t * .12, sl = Math.sin(lat);
            var px = sl * Math.cos(lon), py = Math.cos(lat), pz = sl * Math.sin(lon), tl = .42, ct = Math.cos(tl), st = Math.sin(tl);
            var y2 = py * ct - pz * st, z2 = py * st + pz * ct, p = 1 / (1 + z2 * .3);
            var x = px * .95 * p, y = y2 * .95 * p, a = Math.atan2(-Math.cos(lon) * st, -Math.sin(lon));
            var c = COL[Math.floor(R3 * COL.length)], hx = Math.cos(a) * len / 2, hy = Math.sin(a) * len / 2, X = cx + x * R, Y = cy + y * R;
            ctx.globalAlpha = z2 > 0 ? .2 : .95; ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(X - hx, Y - hy); ctx.lineTo(X + hx, Y + hy); ctx.stroke();
          }
          ctx.globalAlpha = 1;
        } };
      };
    })();

    /* ---- 510 Visuals: the dotted continent globe ---- */
    SIG['510-visuals'] = (function(){
      // the 510 globe's land dots, 2° lat × 2.5° lon (vendor/510-globe.js LAND_DOTS, Antarctica cap added like the site)
      var B64 = 'ESwRLRItEysTLBQqFCsULBRVFSoVKxUsFS0WKhYrFiwWLRaLFowXKxcsFy0XjBgrGCwYLRguGIIYgxiNGI4ZKxksGS0ZLhkvGYMZjhorGiwaLRouGi8aMBoxGoEaghqDGoQajhqPGysbLBstGy4bLxswGzEbfxuAG4EbghuDG4QcKxwsHC0cLhwvHDAcMRwyHFAcURx2HHccfxyAHIEcghyDHIQdLB0tHS4dLx0wHTEdMh0zHU8dUB1RHVIdUx13HXgdeR16HXsdfB19HX4dfx2AHYEdgh2DHYQdhR4sHi0eLh4vHjAeMR4yHjMeNB5PHlAeUR5SHlMeVB52HnceeB55Hnoeex58Hn0efh5/HoAegR6CHoMehB6FHywfLR8uHy8fMB8xHzIfMx80H08fUB9RH1IfUx9UH1Ufdh93H3gfeR96H3sffB99H34ffx+AH4Efgh+DH4QfhSAsIC0gLiAvIDAgMSAyIDMgNCBOIE8gUCBRIFIgUyBUIFUgdiB3IHggeSB6IHsgfCB9IH4gfyCAIIEggiCDIIQghSEsIS0hLiEvITAhMSEyITMhNCE1IU4hTyFQIVEhUiFTIVQhVSFWIVkhWiFbIXYhdyF4IXkheiF7IXwhfSF+IX8hgCGBIYIhgyGEIiwiLSIuIi8iMCIxIjIiMyI0IjUiNiI3Ik4iTyJQIlEiUiJTIlQiVSJWIloiWyJ3IngieSJ6InsifCJ9In4ifyKAIoEigiKDIoQjLCMtIy4jLyMwIzEjMiMzIzQjNSM2IzcjOCNOI08jUCNRI1IjUyNUI1UjWiNbI3gjeSN6I3sjfCN9I34jfyOAI4EjgiODJCwkLSQuJC8kMCQxJDIkMyQ0JDUkNiQ3JDgkTSROJE8kUCRRJFIkUyRUJFUkViRXJFokWyR5JHokeyR8JH0kfiR/JIAkgSSCJIwkjyUrJSwlLSUuJS8lMCUxJTIlMyU0JTUlNiU3JTglTSVOJU8lUCVRJVIlUyVUJVUlViVXJVglWiVbJXoleyV8JX0lfiWBJYImKiYrJiwmLSYuJi8mMCYxJjImMyY0JjUmNiY3JjgmTSZOJk8mUCZRJlImUyZUJlUmViZXJlgmWyZcJnsmfCZ9Jn4mgSaCJyknKicrJywnLScuJy8nMCcxJzInMyc0JzUnNic3JzgnOSdOJ08nUCdRJ1InUydUJ1UnVidXJ1gnfSgpKCooKygsKC0oLigvKDAoMSgyKDMoNCg1KDYoNyg4KDkoTShOKE8oUChRKFIoUyhUKFUoVihXKFgogSiEKIkpKSkqKSspLCktKS4pLykwKTEpMikzKTQpNSk2KTcpOCk5KTopTSlOKU8pUClRKVIpUylUKVUpVilXKVgpcyl0KXUpgCmBKYIpgyooKikqKiorKiwqLSouKi8qMCoxKjIqMyo0KjUqNio3KjgqOSpNKk4qTypQKlEqUipTKlQqVSpWKlcqcipzKoAqgSqCKoMqhisoKykrKisrKywrLSsuKy8rMCsxKzIrMys0KzUrNis3KzgrOStMK00rTitPK1ArUStSK1MrVCtVK1YrVytYK3Ercit2K3greSt7K34rfyuAK4ErgiwoLCksKiwrLCwsLSwuLC8sMCwxLDIsMyw0LDUsNixMLE0sTixPLFAsUSxSLFMsVCxVLFYsVyxYLHEscix0LHUsdix4LH0sfy0kLSgtKS0qLSstLC0tLS4tLy0wLTEtMi0zLTQtTC1NLU4tTy1QLVEtUi1TLVQtVS1WLVctWC1ZLXAtcS10LXUtdi13LXgteS16LXstfS4pLiouKy4sLi0uLi4vLjAuMS4yLjMuNC5MLk0uTi5PLlAuUS5SLlMuVC5VLlYuVy5YLlkuWi5wLnEudS52LncvKi8rLywvLS8uLy8vMC8xLzIvMy9FL0ovTC9NL04vTy9QL1EvUi9TL1QvVS9WL1cvWC9ZL1ovWy9vL3Evdi93MCkwKjArMCwwLTAuMC8wMDAxMDMwRDBFMEYwRzBIMEkwSjBLMEwwTTBOME8wUDBRMFIwUzBUMFUwVjBXMFgwWTBaMFswaDBuMG8wcDBxMHcwejEpMSoxKzEsMS0xLjEvMTAxQzFEMUUxRjFHMUgxSTFKMUsxTDFNMU4xTzFQMVExUjFTMVQxVTFWMVcxWDFZMVoxWzFcMWgxaTFwMXkxejImMicyKDIqMisyLDItMi4yLzJDMkQyRTJGMkcySDJJMkoySzJMMk0yTjJPMlAyUTJSMlMyVDJVMlYyVzJYMlkyWjJbMlwyZjJnMmgycDJyMnMyeTJ6MyYzKzNCM0MzRDNFM0YzRzNIM0kzSjNLM0wzTTNOM08zUDNRM1IzUzNUM1UzVjNXM1gzWTNmM2czaDNwM3EzcjNzM3QzejQjNCQ0JTQmNCc0QTRCNEM0RDRFNEY0RzRINEk0SjRLNEw0TTRONE80UDRRNFI0UzRUNFU0VjRXNFg0WTRaNFs0XDRmNGc0aDRvNHA0cTRyNHM0dDR4NHk1ITUiNSM1JDVCNUM1RDVFNUY1RzVINUk1SjVLNUw1TTVONU81UDVRNVI1UzVUNVU1VjVXNVk1WjVbNVw1XTVlNWY1ZzVoNW41bzVwNXE1cjVzNXk2HzYgNiE2IjYjNiQ2JTZCNkM2RDZFNkY2RzZINkk2SjZLNkw2TTZONk82UDZRNlI2UzZUNlU2VjZXNlk2WjZbNlw2XTZeNmY2ZzZoNmk2bjZvNnA2cTZyNnM2eDceNx83IDchNyQ3JTcpNyo3KzcsN0I3QzdEN0U3RjdHN0g3STdKN0s3TDdNN043TzdQN1E3UjdTN1Q3VTdWN1c3WDdZN1o3WzdcN103XjdfN2U3ZjdnN2g3aTdqN203bjdvN3A3cTdyN3Q4HjgfOCA4ITgoOCk4QjhDOEQ4RThGOEc4SDhJOEo4SzhMOE04TjhPOFA4UThSOFM4VDhVOFY4WDhZOFo4WzhcOF04XjhfOGQ4ZThmOGc4aDhpOGo4azhtOG44bzhwOHE4cjhzOHQ5HDkdOR45HzkgOSE5KTlCOUM5RDlFOUY5RzlIOUk5SjlLOUw5TTlOOU85UDlROVI5UzlUOVU5VjlXOVg5WTlaOVs5XDldOV45XzljOWQ5ZTlmOWc5aDlpOWo5azlsOW05bjlvOXA5cTlyOXM5dDl1OXY5dzl5Ohs6HToeOh86IDohOig6KTpDOkQ6RTpGOkc6SDpJOko6SzpMOk06TjpPOlA6UTpSOlM6VDpVOlc6WDpZOlo6WzpcOl86YDphOmI6YzpkOmU6ZjpnOmg6aTpqOms6bDptOm46bzpwOnE6cjpzOnQ6dTp2Onc6eDsaOxw7HTseOx87IDshOyc7KDtDO0Q7RTtGO0c7SDtJO0o7SztMO007TjtPO1A7UTtSO1M7VDtVO1Y7VztYO1k7WjtbO107XjtfO2A7YTtiO2M7ZDtlO2Y7ZztoO2k7ajtrO2w7bTtuO287cDtxO3I7czt0O3U7djt3O3g8GjwbPBw8HTwePB88IDwhPCI8IzwkPCY8JzxFPEY8RzxIPEk8SjxLPEw8TTxOPE88UDxRPFI8UzxUPFU8VjxXPFg8WTxaPFs8XTxePF88YDxhPGI8YzxkPGU8ZjxnPGg8aTxqPGs8bDxtPG48bzxwPHE8cjxzPHQ8dTx2PHc8eDx5PRk9Gj0bPRw9HT0ePR89ID0hPSI9Iz0kPSU9Jj0nPUQ9RT1GPUc9SD1JPUo9Sz1MPU09Tj1QPVE9Uj1WPVc9WD1ZPVo9Wz1cPV09Xj1fPWA9YT1iPWM9ZD1lPWY9Zz1oPWk9aj1rPWw9bT1uPW89cD1xPXI9cz10PXU9dj13PXg9fD4YPhk+Gj4bPhw+HT4ePh8+ID4hPiI+Iz4kPiU+Jj4nPig+KT5FPkY+Rz5IPkk+Sj5LPkw+TT5XPlg+WT5aPls+XD5dPl4+Xz5gPmE+Yj5jPmQ+ZT5mPmc+aD5pPmo+az5sPm0+bj5vPnA+cT5yPnM+dD51PnY+dz59Pn4/GD8ZPxo/Gz8cPx0/Hj8fPyA/IT8iPyM/JD8lPyY/Jz8oPyk/Rj9IP0k/Sj9LP0w/Vz9YP1k/Wj9bP1w/XT9eP18/YD9hP2I/Yz9kP2U/Zj9nP2g/aT9qP2s/bD9tP24/bz9wP3E/cj9zP3Q/dT92P3c/ez98P38/gEAXQBhAGUAaQBtAHEAdQB5AH0AgQCFAIkAjQCRAJUAmQCdAKEApQCpARUBGQEdASEBOQFFAUkBTQFRAVUBWQFdAWEBZQFpAW0BcQF1AXkBfQGBAYUBiQGNAZEBlQGZAZ0BoQGlAakBrQGxAbUBuQG9AcEBxQHJAc0B0QHVAdkB3QHhAeUB7QHxAgEEXQRhBGUEaQRtBHEEdQR5BH0EgQSFBIkEjQSRBJUEmQSdBKEEpQSpBRUFGQUdBSEFQQVNBVEFVQVZBV0FYQVlBWkFbQVxBXUFeQV9BYEFhQWJBY0FkQWVBZkFnQWhBaUFqQWtBbEFtQW5Bb0FwQXFBckFzQXRBdUF2QXdBeEF5QXpBe0GBQhZCF0IYQhlCGkIbQhxCHUIeQh9CIEIhQiJCI0IkQiVCJkInQihCKUIqQitCRUJGQkdCSEJNQk5CT0JQQlFCUkJTQlVCVkJYQllCWkJbQlxCXUJeQl9CYEJhQmJCY0JkQmVCZkJnQmhCaUJqQmtCbEJtQm5Cb0JwQnFCckJzQnRCdUJ2QndCeEJ5QnpCe0J8QoBCgUMXQxhDGUMaQxtDHEMdQx5DH0MgQyFDIkMjQyRDJUMmQydDKEMpQypDK0MsQy5DSENJQ0pDS0NNQ05DT0NQQ1FDUkNTQ1hDWUNaQ1tDXENdQ15DX0NgQ2FDYkNjQ2RDZUNmQ2dDaENpQ2pDa0NsQ21DbkNvQ3BDcUNyQ3NDdEN1Q3ZDd0N4Q3lDekN7Q3xDfUN+Q4FEF0QYRBlEGkQbRBxEHUQeRB9EIEQhRCJEI0QkRCVEJkQnRChEKUQqRCtELEQtRC5EL0RIRElESkRLRExETURORE9EUERRRFJEU0RURFVEVkRXRFhEWURaRFtEXERdRF5EX0RgRGFEYkRjRGREZURmRGdEaERpRGpEa0RsRG1EbkRvRHBEcURyRHNEdER1RHZEd0R4RHlEekR7RHxEfUR+RIFFF0UYRRlFGkUbRRxFHUUeRR9FIEUhRSJFI0UkRSVFJkUnRShFKUUqRStFLEUtRS5FMUUyRTNFR0VIRUlFSkVLRUxFTUVORU9FUEVRRVJFU0VURVVFVkVXRVhFWUVaRVtFXEVdRV5FX0VgRWFFYkVjRWRFZUVmRWdFaEVpRWpFa0VsRW1FbkVvRXBFcUVyRXNFdEV1RXZFd0V4RXlFekV7RXxFfUV+RX9FgUYWRhdGGEYZRhpGG0YcRh1GHkYfRiBGIUYiRiNGJEYlRiZGJ0YoRilGKkYrRixGLUYxRklGSkZLRkxGTUZORk9GUEZRRlJGU0ZURlVGVkZXRlhGWUZaRltGXEZdRl5GX0ZgRmFGYkZjRmRGZUZmRmdGaEZpRmpGa0ZsRm1GbkZvRnBGcUZyRnNGdEZ1RnZGd0Z4RnlGekZ7RnxGfUZ+Rn9GgEaBRwRHE0cVRxZHF0cYRxlHGkcbRxxHHUceRx9HIEchRyJHI0ckRyVHJkcnRyhHKUcqRytHLEctRy5HL0cwRzFHRUdHR0hHSUdKR0tHTEdNR05HT0dQR1FHUkdTR1RHVUdWR1dHWEdZR1pHW0dcR11HXkdfR2BHYUdiR2NHZEdlR2ZHZ0doR2lHakdrR2xHbUduR29HcEdxR3JHc0d0R3VHdkd3R3hHeUd6R3tHfEd9R35Hf0eAR4FHh0gTSBRIFUgWSBdIGEgZSBpIG0gcSB1IHkgfSCBIIUgiSCNIJEglSCZIJ0gpSCpIK0gsSC1ILkgvSDBIMUhFSEdITEhNSE5IT0hQSFFIUkhTSFRIVUhWSFdIWEhZSFpIW0hcSF1IXkhfSGBIYUhiSGNIZEhlSGZIZ0hoSGlIakhrSGxIbUhuSG9IcEhxSHJIc0h0SHVIdkh3SHhIeUh6SHtIfEh9SH5IgEiHSRJJE0kUSRVJFkkXSRhJGUkaSRtJHEkdSR5JH0kgSSFJIkkjSSRJJkkpSSpJK0ksSS1JLkkvSUdJTUlOSVFJUklTSVRJVUlWSVdJWElZSVpJW0lcSV1JXklfSWBJYUliSWNJZEllSWZJZ0loSWlJaklrSWxJbUluSW9JcElxSXJJc0l0SXVJdkl3SXhJeUl6SXtJfEl9SX5Jf0mHSYhJiUoKShJKE0oUShVKFkoXShhKGkobShxKHUoeSh9KIEohSiJKKUorSixKLUouSi9KRkpOSk9KUkpTSlRKVUpWSldKWEpZSlpKW0pcSl5KX0pgSmFKYkpjSmRKZUpmSmdKaEpqSmtKbEptSm5KcEpxSnJKc0p0SnVKdkp3SnhKeUp6SntKfEp9Sn5Kf0qISwhLCUsKSw5LEEsRSxJLE0sUSxVLFksXSxhLGUsbSxxLHUseSx9LIEshSylLKksrSzVLSktLS0xLTUtPS1FLVEtVS1ZLV0tYS1lLWktbS1xLXUteS19LYEthS2JLY0tkS2VLZktnS2hLaUtqS2tLbEtuS29LcEtxS3JLc0t0S3VLdkt3S3hLeUt6S3tLfEt9S35Lf0uAS4FLg0uES4VLiUuMTAZMB0wITApMC0wMTA1MD0wQTBFMEkwTTBRMFUwWTBdMGEwZTBtMHEwdTB5MH0whTCJMJ0wpTCpMLEwtTDRMNUw2TEtMTExNTE9MUUxSTFNMVUxWTFdMWExZTFpMW0xcTF1MXkxgTGFMYkxjTGRMZkxnTGhMaUxqTGxMbUxuTG9McExyTHNMdEx1THdMeEx5THpMe0x8TH1Mfkx/TIBMgUyDTIRMhUyGTIdMiEyJTIpMi0yMTI1NCU0KTQtNDU0OTQ9NEE0STRNNFE0WTRdNGE0ZTRtNHE0dTR5NIE0hTSJNJE0mTSdNK00sTS5NNE01TTdNQU1MTU1NT01QTVNNVE1VTVZNWE1ZTVpNW01dTV5NX01gTWJNY01kTWVNZ01oTWlNak1sTW1Nbk1wTXFNck1zTXVNdk13TXhNek17TXxNfk1/TYBNg02ETYVNhk2ITYlNik2LTY1Njk2PTgFOBE4FTgZOB04ITglOCk4LTgxODU4OTg9OEE4RThJOE04UThVOF04YThlOG04cTh1OHk4fTiBOIU4iTiNOJE4lTiZOJ04oTilOKk4rTixOLU4vTjBOMU4zTjRONU42TjdOOE45TjpOO048Tj1OPk4/TkBOQU5CTkNORE5FTkZOR05ITklOS05MTlFOV05ZTmROgU8BTwNPBE8GTwdPCU8KTwxPDk8PTxBPEk8TTxVPFk8YTxlPG08cTx5PH08hTyJPJE8lTydPKE8qTytPLU8uTzBPMU8zTzRPNk83TzlPOk88Tz1PP09AT0JPQ09FT0ZPSE9JT0tPTE9OT1hPW09mUAhQClALUA1QDlAQUBNQFVAYUBlQGlAbUB1QHlAiUCNQJVAmUCdQKVArUC1QM1A1UDZQN1A4UDlQOlA7UDxQPVA+UFBQUVBSUFNQVFBeUGFQZFBmUGdQaFBpUGpQa1BsUG1QblBvUHBQcVByUHNQdFB1UHZQd1B5UHtQfFB+UH9QgFCBUIJQg1CEUIVQhlCHUIlQilCOUI9RFlEYURpRG1EdUSFRJVEnUShRM1E1UTdROVE7UTxRPlFdUWVRalFsUW5RcFFyUXNRdVF3UXlRe1GAUYJSFlIYUhxSHlIgUiRSJVInUjJSNFI2UjhSOlI8Uj5SP1JpUmpSbFJuUnBSclKBUyJTI1M0UzpTPFNXU19TblNwU3RTgQ==', D = null;
      function dots(){
        if (D) return D; D = [];
        var bin = atob(B64), i, lat, lng, step;
        for (i = 0; i < bin.length; i += 2) D.push([bin.charCodeAt(i) * 2 - 90, bin.charCodeAt(i + 1) * 2.5 - 180]);
        for (lat = -64; lat >= -84; lat -= 3){ step = 3 / Math.max(.15, Math.cos(lat * Math.PI / 180)); for (lng = -180; lng < 180; lng += step) D.push([lat, lng]); }
        D.forEach(function(d){ var la = d[0] * Math.PI / 180, lo = d[1] * Math.PI / 180, r = Math.random(); d.push(Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo), r > .85 ? '#b8c9cc' : r > .6 ? '#5a8a94' : '#37535a'); });
        return D;
      }
      // the site's three HQ pins (Brooklyn, Shenzhen, Brussels) and its arcs, turned into thin rings around the globe
      var PINS = [[40.68, -73.94], [22.54, 114.06], [50.85, 4.35]];
      var RINGS = [{ r: 1.22, inc: .42, node: .3, sp: .55 }, { r: 1.36, inc: -.62, node: 1.9, sp: -.4 }, { r: 1.5, inc: .78, node: 3.6, sp: .3 }];
      function v3(lat, lng){ var la = lat * Math.PI / 180, lo = lng * Math.PI / 180; return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)]; }
      return function(R){
        var list = dots(), small = R < 26;
        return { pad: small ? 1.3 : 1.62, draw: function(ctx, cx, cy, t){
          var rot = t * .16, cr = Math.cos(rot), sr = Math.sin(rot), tl = .38, ct = Math.cos(tl), st = Math.sin(tl);
          // world → screen: spin about the axis, tilt toward the viewer; returns [x, y, depth]
          function pr(x, y, z, spin){ var X = spin ? x * cr - z * sr : x, Z = spin ? x * sr + z * cr : z; return [X, y * ct - Z * st, y * st + Z * ct]; }
          var i, k, q, a;
          ctx.lineWidth = Math.max(.6, R / 260);
          // graticule: lat every 30° (−60..60), lng every 30°, thin, the back half fainter (the globe is see-through)
          if (!small){
            ctx.strokeStyle = '#5a8a94';
            for (var lat = -60; lat <= 60; lat += 30) for (var ln = -180; ln < 180; ln += 6){ seg(v3(lat, ln), v3(lat, ln + 6)); }
            for (var lg = -180; lg < 180; lg += 30) for (var lt = -90; lt < 90; lt += 6){ seg(v3(lt, lg), v3(lt + 6, lg)); }
          }
          function seg(p0, p1){ var A = pr(p0[0], p0[1], p0[2], true), B = pr(p1[0], p1[1], p1[2], true); ctx.globalAlpha = (A[2] + B[2]) > 0 ? .22 : .07; ctx.beginPath(); ctx.moveTo(cx + A[0] * R, cy - A[1] * R); ctx.lineTo(cx + B[0] * R, cy - B[1] * R); ctx.stroke(); }
          // continent dots, front bright, back faint
          var dr = Math.max(.55, R / (small ? 30 : 120)), skip = small ? 3 : R < 70 ? 2 : 1;
          for (i = 0; i < list.length; i += skip){
            var d = list[i]; q = pr(d[2], d[3], d[4], true);
            ctx.globalAlpha = q[2] >= 0 ? .4 + .55 * q[2] : .1; ctx.fillStyle = d[5];
            ctx.fillRect(cx + q[0] * R - dr, cy - q[1] * R - dr, dr * 2, dr * 2);
          }
          // pins on the front: a teal core with a glow
          PINS.forEach(function(pn){ var v = v3(pn[0], pn[1]); q = pr(v[0], v[1], v[2], true); if (q[2] < .05) return; glow(cx + q[0] * R, cy - q[1] * R, Math.max(1.4, R / 70), .9); });
          function glow(x, y, r, al){ var g = ctx.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(94,234,212,' + al + ')'); g.addColorStop(.3, 'rgba(45,212,191,' + al * .5 + ')'); g.addColorStop(1, 'rgba(45,212,191,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill(); }
          // the arcs as rings: tilted circles around the globe, each with a pin of light travelling along it;
          // the part behind the globe is dimmer
          RINGS.forEach(function(rg, ri){
            var ci = Math.cos(rg.inc), si = Math.sin(rg.inc), cn = Math.cos(rg.node), sn = Math.sin(rg.node), prev = null, n = 96;
            function pt(u){ var x = Math.cos(u) * rg.r, z = Math.sin(u) * rg.r, y = z * si; z = z * ci; var X = x * cn - z * sn, Z = x * sn + z * cn; return pr(X, y, Z, false); }
            ctx.lineWidth = Math.max(.7, R / 200);
            for (k = 0; k <= n; k++){
              q = pt(k / n * Math.PI * 2);
              if (prev){ var behind = (prev[2] + q[2]) < 0 && Math.hypot((prev[0] + q[0]) / 2, (prev[1] + q[1]) / 2) < 1; ctx.globalAlpha = behind ? .1 : .55; ctx.strokeStyle = ri ? '#2dd4bf' : '#5eead4'; ctx.beginPath(); ctx.moveTo(cx + prev[0] * R, cy - prev[1] * R); ctx.lineTo(cx + q[0] * R, cy - q[1] * R); ctx.stroke(); }
              prev = q;
            }
            if (!small){ a = t * rg.sp + ri * 2.1; q = pt(a); var hid = q[2] < 0 && Math.hypot(q[0], q[1]) < 1; if (!hid) glow(cx + q[0] * R, cy - q[1] * R, Math.max(1.2, R / 90), .85); }
          });
          ctx.globalAlpha = 1;
        } };
      };
    })();

    // styles injected from here, so the signature planets ship with the script alone (no stylesheet release)
    var css = document.createElement('style'); css.id = 'sig-planets';
    css.textContent = '.ab_planet.is-sig .sphere,.ab_planet.is-sig .pring,.ab_planet.is-sig .tex{opacity:0!important}' +
      '.ab_planet.is-sig{overflow:visible!important}.ab_planet.is-sig .sig-cv{position:absolute;left:50%;top:50%;pointer-events:none;z-index:2}';
    document.head.appendChild(css);
    function mount(el, slug){
      var make = SIG[slug]; if (!make || el.__sig) return; el.__sig = true;
      el.classList.add('is-sig', 'is-sig-' + slug);
      var cv = document.createElement('canvas'); cv.className = 'sig-cv'; cv.setAttribute('aria-hidden', 'true'); el.appendChild(cv);
      var ctx = cv.getContext('2d'), P = null, W = 0, H = 0, raf = 0, on = false, t0 = 0;
      function size(){
        var r = el.getBoundingClientRect(), R = r.width / 2; if (!R) return false;
        P = make(R); var s = R * 2 * P.pad, dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.style.width = cv.style.height = s + 'px'; cv.style.marginLeft = cv.style.marginTop = (-s / 2) + 'px';
        W = H = s; cv.width = cv.height = Math.round(s * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        P.R = R; return true;
      }
      function frame(now){
        if (!P) return; var t = reduce ? 6 : ((now || 0) - t0) / 1000 + 6;
        ctx.clearRect(0, 0, W, H); P.draw(ctx, W / 2, H / 2, t);
        raf = on && !reduce ? requestAnimationFrame(frame) : 0;
      }
      if (!size()) return;
      t0 = window.performance ? performance.now() : 0;
      frame(t0);
      var lw = innerWidth; addEventListener('resize', function(){ if (innerWidth !== lw){ lw = innerWidth; if (size()) frame(performance.now()); } });
      if (window.IntersectionObserver) new IntersectionObserver(function(es){
        on = es[0].isIntersecting; if (on && !raf && !reduce){ raf = requestAnimationFrame(frame); }
      }, { rootMargin: '100px' }).observe(el);
    }

    // this page's own planet: the hero + the manifest status card
    if (SIG[SLUG]){
      var hp = $('#hero .ab_planet[data-slug]'); if (hp) mount(hp, SLUG);
      $$('.ab_planet.is-mf, .ab_planet.is-orbit').forEach(function(p){ mount(p, SLUG); });
    }
    // the next-mission card, when the next mission has a signature planet
    if (NEXT && SIG[NEXT.slug]) $$('.ab_next-card .ab_planet').forEach(function(p){ mount(p, NEXT.slug); });
  })();
