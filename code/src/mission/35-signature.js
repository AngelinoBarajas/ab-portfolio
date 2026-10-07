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
        // four regular rings, one per weave color (Angelino 2026-10-04): concentric, one tilted plane, thread dashes
        // drifting along each; the half behind the globe is drawn first and dimmer
        var RG = ['#9b87f5', '#ef5b3f', '#139e8a', '#4f7bff'], RR = [1.24, 1.36, 1.48, 1.6], NR = small ? 0 : R < 70 ? 50 : 110;
        function rings(ctx, cx, cy, t, front, len, lw, en){
          var open = .24, tilt = -.24, ca = Math.cos(tilt), sa = Math.sin(tilt);
          ctx.lineWidth = lw * (1.15 + .5 * en);
          RG.forEach(function(col, k){
            var r = RR[k], n = Math.round(NR * r / 1.4);
            for (var i = 0; i < n; i++){
              var u = (i / n) * Math.PI * 2 + t * (.05 + k * .015), cu = Math.cos(u), su = Math.sin(u);
              if ((su > 0) !== front) continue;
              var wv = en ? Math.sin(u * 9 - t * 4 + k) * .06 * en : 0, rw = r + wv, ex = rw * cu, ey = rw * Math.sin(open) * su, x = ex * ca - ey * sa, y = ex * sa + ey * ca;
              var tx = -r * su, ty = r * Math.sin(open) * cu, dx = tx * ca - ty * sa, dy = tx * sa + ty * ca, tl = Math.sqrt(dx * dx + dy * dy) || 1;
              ctx.globalAlpha = Math.min(1, (front ? .85 : (x * x + y * y < 1 ? .08 : .35)) + .25 * en);
              var X = cx + x * R, Y = cy + y * R, hx = dx / tl * len * .75, hy = dy / tl * len * .75;
              ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(X - hx, Y - hy); ctx.lineTo(X + hx, Y + hy); ctx.stroke();
            }
          });
          ctx.globalAlpha = 1;
        }
        return { pad: NR ? 1.7 : 1.12, pulse: '155,135,245', draw: function(ctx, cx, cy, t, en){
          en = en || 0;
          var len = Math.max(2.2, R * (small ? .2 : R < 70 ? .09 : .07)), lw = Math.max(1, Math.min(1.6, R / 70));
          ctx.lineCap = 'round';
          if (NR) rings(ctx, cx, cy, t, false, len, lw, en);
          ctx.lineWidth = lw;
          for (var i = 0; i < N; i++){
            var R1 = rr[i * 3], R2 = rr[i * 3 + 1], R3 = rr[i * 3 + 2];
            // a point on the sphere, turning, tilted toward us; the thread lies along its latitude, back threads faint
            var lat = Math.acos(2 * R1 - 1), lon = R2 * TAU + t * .12, sl = Math.sin(lat);
            var px = sl * Math.cos(lon), py = Math.cos(lat), pz = sl * Math.sin(lon), tl = .42, ct = Math.cos(tl), st = Math.sin(tl);
            var y2 = py * ct - pz * st, z2 = py * st + pz * ct, p = 1 / (1 + z2 * .3);
            var sw = en ? 1 + Math.sin(lat * 9 + t * 4 + R3 * 6) * .06 * en : 1, x = px * .95 * p * sw, y = y2 * .95 * p * sw, a = Math.atan2(-Math.cos(lon) * st, -Math.sin(lon));
            var c = COL[Math.floor(R3 * COL.length)], hx = Math.cos(a) * len / 2, hy = Math.sin(a) * len / 2, X = cx + x * R, Y = cy + y * R;
            ctx.globalAlpha = z2 > 0 ? .2 + .35 * en : .95; ctx.strokeStyle = c; ctx.lineWidth = lw * (1 + .6 * en); ctx.beginPath(); ctx.moveTo(X - hx, Y - hy); ctx.lineTo(X + hx, Y + hy); ctx.stroke();
          }
          if (NR) rings(ctx, cx, cy, t, true, len, lw, en);
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
        return { pad: small ? 1.3 : 1.62, pulse: '94,234,212', draw: function(ctx, cx, cy, t, en){
          en = en || 0;
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
            ctx.globalAlpha = q[2] >= 0 ? Math.min(1, .4 + .55 * q[2] + .3 * en) : .1 + .1 * en; ctx.fillStyle = en > .5 && d[5] === '#37535a' ? '#5a8a94' : d[5];
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
              if (prev){ var behind = (prev[2] + q[2]) < 0 && Math.hypot((prev[0] + q[0]) / 2, (prev[1] + q[1]) / 2) < 1; ctx.globalAlpha = behind ? .1 : .55 + .4 * en; ctx.strokeStyle = ri ? '#2dd4bf' : '#5eead4'; ctx.beginPath(); ctx.moveTo(cx + prev[0] * R, cy - prev[1] * R); ctx.lineTo(cx + q[0] * R, cy - q[1] * R); ctx.stroke(); }
              prev = q;
            }
            if (!small){ a = t * rg.sp + ri * 2.1; q = pt(a); var hid = q[2] < 0 && Math.hypot(q[0], q[1]) < 1; if (!hid) glow(cx + q[0] * R, cy - q[1] * R, Math.max(1.2, R / 90), .85); }
          });
          ctx.globalAlpha = 1;
        } };
      };
    })();

    /* ---- kip: baby June's head, with the crib mobile turning around her ---- */
    // Angelino 2026-10-06: June's head is the planet and the rings are the nursery mobile spinning. The head is the real 3D
    // character (shot on the live kipvillage.com scene against its green booth: vendor/kip/june-head.webp); the rings are the
    // mobile's wire arms, its butter stars and mint/rose balls hanging on short strings, the half behind her head dimmer.
    SIG.kip = (function(){
      var img = null, ok = false, waits = [];
      function load(){
        if (img) return; img = new Image(); img.decoding = 'async';
        img.onload = function(){ ok = true; waits.forEach(function(f){ f(); }); waits = []; };
        img.src = VENDOR + 'kip/june-head.webp';
      }
      // the cut-out is 373 × 357: the skull is ~290 px wide, centered at (186, 206); the curl rises above it
      var IW = 373, IH = 357, SKULL = 290, SCX = 186, SCY = 206;
      var STAR = '#FFC94A', MINT = '#5FD3A8', ROSE = '#FF8FA3', WIRE = '#FFF4E6';
      // two arms of the mobile: radius (× R), tilt, turn speed, and what hangs from each
      var ARMS = [
        { r: 1.36, open: .3, tilt: -.16, sp: .32, items: ['star', 'mint', 'star', 'rose', 'star', 'mint', 'rose'] },
        { r: 1.68, open: .24, tilt: .12, sp: -.22, items: ['rose', 'star', 'mint', 'star', 'rose', 'star'] }
      ];
      function star(ctx, x, y, s, hi){
        ctx.beginPath();
        for (var i = 0; i < 10; i++){ var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? s * .48 : s; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
        ctx.closePath();
        var g = ctx.createRadialGradient(x - s * .3, y - s * .35, s * .1, x, y, s * 1.1);
        g.addColorStop(0, hi ? '#FFF1BF' : '#FFE38A'); g.addColorStop(.55, STAR); g.addColorStop(1, '#E2A21C');
        ctx.fillStyle = g; ctx.lineJoin = 'round'; ctx.lineWidth = s * .28; ctx.strokeStyle = g; ctx.stroke(); ctx.fill();
      }
      function ball(ctx, x, y, s, col, hi){
        var g = ctx.createRadialGradient(x - s * .35, y - s * .4, s * .08, x, y, s);
        g.addColorStop(0, hi ? '#ffffff' : 'rgba(255,255,255,.9)'); g.addColorStop(.35, col); g.addColorStop(1, col === MINT ? '#2E9E76' : '#D9607A');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
      return function(R){
        load();
        var small = R < 26;
        function arms(ctx, cx, cy, t, front, en){
          ARMS.forEach(function(A, ai){
            if (small && ai) return;
            // the ring plane sits at her chin, so the pieces cross below her eyes
            var ca = Math.cos(A.tilt), sa = Math.sin(A.tilt), so = Math.sin(A.open), rr = A.r * R;
            function pt(u){ var ex = rr * Math.cos(u), ey = rr * so * Math.sin(u); return [cx + ex * ca - ey * sa, cy + R * .24 + ex * sa + ey * ca, Math.sin(u)]; }
            // the wire: the far half first (behind her head), the near half after it
            ctx.lineWidth = Math.max(.8, R / 110); ctx.strokeStyle = WIRE; ctx.lineCap = 'round';
            var prev = null, n = 72;
            for (var k = 0; k <= n; k++){
              var p = pt(k / n * Math.PI * 2);
              if (prev && ((p[2] + prev[2]) > 0) === front){ ctx.globalAlpha = front ? .7 + .25 * en : .28; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke(); }
              prev = p;
            }
            // the hanging pieces turn with the arm; each swings a little on its string
            var N = A.items.length, rot = t * A.sp * (1 + 1.6 * en);
            A.items.forEach(function(kind, i){
              var u = rot + i / N * Math.PI * 2, p = pt(u);
              if ((p[2] > 0) !== front) return;
              var depth = .82 + .18 * p[2], s = Math.max(1.6, R * (small ? .2 : .13)) * depth, len = R * (small ? .12 : .17) * depth;
              var sw = Math.sin(t * 1.7 + i * 1.9 + ai) * .16 * (1 + en), hx = p[0] + Math.sin(sw) * len, hy = p[1] + Math.cos(sw) * len;
              ctx.globalAlpha = front ? 1 : .55;
              if (!small){ ctx.lineWidth = Math.max(.6, R / 160); ctx.strokeStyle = WIRE; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(hx, hy); ctx.stroke(); }
              if (kind === 'star') star(ctx, hx, hy + s * .8, s * 1.1, en > .3); else ball(ctx, hx, hy + s * .8, s * .82, kind === 'mint' ? MINT : ROSE, en > .3);
            });
          });
          ctx.globalAlpha = 1;
        }
        return { pad: small ? 1.75 : 1.95, pulse: '255,201,74', ready: function(f){ if (ok) f(); else waits.push(f); }, draw: function(ctx, cx, cy, t, en){
          en = en || 0;
          arms(ctx, cx, cy, t, false, en);
          if (ok){
            // her head: the skull fills 80% of the planet circle, so the mobile stays inside the planet's reach; a slow sway, a happy bob when charged
            var sc = R * 1.6 / SKULL * (1 + .035 * en * Math.sin(t * 9)), w = IW * sc, h = IH * sc;
            ctx.save(); ctx.translate(cx, cy + Math.sin(t * .9) * R * .025); ctx.rotate(Math.sin(t * .55) * .07);
            ctx.drawImage(img, -SCX * sc, -SCY * sc, w, h); ctx.restore();
          }
          arms(ctx, cx, cy, t, true, en);
        } };
      };
    })();

    // styles injected from here, so they ship with the script alone (no stylesheet release)
    var css = document.createElement('style'); css.id = 'sig-planets';
    css.textContent = '.ab_planet.is-sig .sphere,.ab_planet.is-sig .pring,.ab_planet.is-sig .tex{opacity:0!important}' +
      '.ab_planet.is-sig{overflow:visible!important}.ab_planet.is-sig .sig-cv{position:absolute;left:50%;top:50%;pointer-events:none;z-index:2}' +
      // monitor scene controls: every button at least 24 × 24 (WCAG 2.2 target size); .scn-pp's own size lost to the
      // `all:unset` on `.scn-ctl button`. Also in ab-mission.css for its next release; injected here so it ships now.
      '.scn-ctl button{min-width:24px;min-height:24px;box-sizing:border-box}.scn-ctl .scn-pp{width:24px;height:24px}';
    document.head.appendChild(css);
    function mount(el, slug){
      var make = SIG[slug]; if (!make || el.__sig) return; el.__sig = true;
      el.classList.add('is-sig', 'is-sig-' + slug);
      var cv = document.createElement('canvas'); cv.className = 'sig-cv'; cv.setAttribute('aria-hidden', 'true'); el.appendChild(cv);
      var ctx = cv.getContext('2d'), P = null, W = 0, H = 0, raf = 0, on = false, last = 0, T = 6, EN = 0, until = 0, pulseT = -9, ptr = null;
      function size(){
        var r = el.getBoundingClientRect(), R = r.width / 2; if (!R) return false;
        P = make(R); var s = R * 2 * P.pad, dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.style.width = cv.style.height = s + 'px'; cv.style.marginLeft = cv.style.marginTop = (-s / 2) + 'px';
        W = H = s; cv.width = cv.height = Math.round(s * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        P.R = R; return true;
      }
      // supercharge (the v3 site's hover "energize"): the threads speed up, brighten and undulate, one pulse runs out
      function frame(now){
        if (!P) return; now = now || 0;
        var dt = last ? Math.min(.05, (now - last) / 1000) : .016; last = now;
        // a resting pointer keeps it charged (also when the page scrolls the planet under a still pointer)
        if (ptr && !reduce){ var br = el.getBoundingClientRect(), qx = ptr[0] - (br.left + br.width / 2), qy = ptr[1] - (br.top + br.height / 2), qr = br.width / 2 * 1.15; if (qx * qx + qy * qy < qr * qr){ if (now >= until) pulseT = now / 1000; until = now + 300; } }
        var want = now < until ? 1 : 0; EN += (want - EN) * Math.min(1, dt * (want ? 4 : 2.5)); if (EN < .002) EN = 0;
        if (!reduce) T += dt * (1 + 2.4 * EN);
        ctx.clearRect(0, 0, W, H); P.draw(ctx, W / 2, H / 2, T, EN);
        var pa = (now / 1000 - pulseT) / 1.1;
        if (pa >= 0 && pa < 1){
          var R = P.R; ctx.globalAlpha = (1 - pa) * .7; ctx.strokeStyle = 'rgb(' + P.pulse + ')'; ctx.lineWidth = Math.max(1, R / 60) * (1 - pa * .6);
          ctx.beginPath(); ctx.arc(W / 2, H / 2, R * (1 + pa * (P.pad - 1) * .95), 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
        }
        raf = (on && !reduce) || EN > 0 || pa < 1 ? requestAnimationFrame(frame) : 0;
      }
      function charge(ms){
        if (reduce) return; var now = performance.now();
        if (now >= until) pulseT = now / 1000;
        until = now + (ms || 900); if (!raf){ last = 0; raf = requestAnimationFrame(frame); }
      }
      if (!size()) return;
      frame(performance.now());
      // a planet drawn from an image (kip) paints again once its picture arrives (one still frame under reduced motion)
      if (P.ready) P.ready(function(){ frame(performance.now()); });
      var lw = innerWidth; addEventListener('resize', function(){ if (innerWidth !== lw){ lw = innerWidth; if (size()) frame(performance.now()); } });
      if (window.IntersectionObserver) new IntersectionObserver(function(es){
        on = es[0].isIntersecting; if (on && !raf && !reduce){ last = 0; raf = requestAnimationFrame(frame); }
      }, { rootMargin: '100px' }).observe(el);
      // mouse: charged while the pointer is over the planet (hit-tested by position, since the hero title sits on top
      // of it); touch: a tap charges it for a moment
      addEventListener('pointermove', function(e){
        if (e.pointerType !== 'mouse' || !P || !on) return;
        var r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), R = r.width / 2 * 1.15;
        ptr = [e.clientX, e.clientY]; if (dx * dx + dy * dy < R * R) charge(700);
      }, { passive: true });
      document.addEventListener('pointerleave', function(){ ptr = null; });
      el.addEventListener('pointerdown', function(e){ if (e.pointerType !== 'mouse') charge(1600); });
    }

    // this page's own planet: the hero + the manifest status card
    if (SIG[SLUG]){
      var hp = $('#hero .ab_planet[data-slug]'); if (hp) mount(hp, SLUG);
      $$('.ab_planet.is-mf, .ab_planet.is-orbit').forEach(function(p){ mount(p, SLUG); });
    }
    // the next-mission card, when the next mission has a signature planet
    if (NEXT && SIG[NEXT.slug]) $$('.ab_next-card .ab_planet').forEach(function(p){ mount(p, NEXT.slug); });
  })();
