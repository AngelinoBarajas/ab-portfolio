  /* ---------- structured data from the same fields the page shows (BlogPosting, DefinedTerm + FAQPage, collections).
     Rendered JSON-LD is read by Google; the native template versions for the Designer are in seo/jsonld/. ---------- */
  (function(){
    if (!VIEW) return;
    var O = location.origin, PERSON = { '@id': O + '/#person' }, SET = O + '/topics#vocabulary', data = null;
    function term(slug){ var t = TOPIC[slug]; return t ? { '@type': 'DefinedTerm', '@id': O + URL_T + t.slug + '#term', name: t.name, url: O + URL_T + t.slug, inDefinedTermSet: SET } : null; }
    function crumbs(list){ return { '@type': 'BreadcrumbList', itemListElement: list.map(function(c, i){ return { '@type': 'ListItem', position: i + 1, name: c[0], item: O + c[1] }; }) }; }
    if (VIEW === 'article'){
      var X = OB[CUR_SLUG]; if (!X) return;
      var desc = $('meta[name="description"]');
      data = [{ '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': O + X.href + '#article', url: O + X.href, headline: X.name,
        description: X.answer.replace(/`/g, ''), abstract: X.answer.replace(/`/g, ''), author: PERSON, publisher: PERSON, inLanguage: 'en-US',
        isPartOf: { '@type': 'Blog', '@id': O + '/observatory#blog', name: 'The Observatory' },
        about: X.topics.map(term).filter(Boolean), timeRequired: X.mins ? 'PT' + X.mins + 'M' : undefined,
        mentions: SVC.map(function(s){ return { '@type': 'Service', '@id': O + s.href + '#service', name: s.name }; }) },
        crumbs([['Home', '/'], ['Observatory', '/observatory'], [X.name, X.href]])];
      if (!desc) data[0].description = X.answer;
    }
    if (VIEW === 'topic'){
      var T = TOPIC[CUR_SLUG]; if (!T) return;
      var t = term(T.slug); t['@context'] = 'https://schema.org'; t.description = T.def;
      data = [t, crumbs([['Home', '/'], ['Topics', '/topics'], [T.name, URL_T + T.slug]])];
      var qs = FAQ.filter(function(q){ return q.topics.indexOf(T.slug) > -1; });
      if (qs.length) data.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs.map(function(q){ return { '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }; }) });
    }
    if (VIEW === 'chart') data = { '@context': 'https://schema.org', '@type': 'DefinedTermSet', '@id': SET, name: 'Site vocabulary', url: O + '/topics',
      hasDefinedTerm: TOPICS.map(function(t){ var d = term(t.slug); d.description = t.def; delete d.inDefinedTermSet; return d; }) };
    if (VIEW === 'library') data = { '@context': 'https://schema.org', '@type': 'Blog', '@id': O + '/observatory#blog', name: 'The Observatory', url: O + '/observatory', author: PERSON,
      blogPost: OBS.map(function(o){ return { '@type': 'BlogPosting', '@id': O + o.href + '#article', headline: o.name, url: O + o.href }; }) };
    if (!data) return;
    var s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-ks-jsonld', '');
    s.text = JSON.stringify(data); document.head.appendChild(s);
  })();
