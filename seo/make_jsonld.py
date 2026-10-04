"""JSON-LD for every page type. Writes seo/jsonld/*.json (static pages, pushed with
bulk_update_pages_schema_markup) and seo/jsonld/*.head.html (CMS templates, pasted into
Template settings > Custom code > Head with the [Field] markers swapped for real field tokens).

python seo/make_jsonld.py                 -> keeps {{DOMAIN}}
python seo/make_jsonld.py https://x.com   -> launch build in seo/jsonld/launch/
"""
import json, sys, pathlib

D = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "{{DOMAIN}}"
OUT = pathlib.Path(__file__).parent / "jsonld" / ("launch" if len(sys.argv) > 1 else "")
OUT.mkdir(parents=True, exist_ok=True)
CTX = "https://schema.org"
PERSON = {"@id": D + "/#person"}
SITE = {"@id": D + "/#website"}
SERVICES = ["webflow-development", "webgl-data", "motion", "branding", "custom-deploys",
            "cms-integrations", "design-systems", "performance"]

def crumbs(path, *trail):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": D + "/"}]
    for i, (name, url) in enumerate(trail, 2):
        li = {"@type": "ListItem", "position": i, "name": name}
        if url: li["item"] = url
        items.append(li)
    return {"@type": "BreadcrumbList", "@id": D + path + "#breadcrumb", "itemListElement": items}

def page(t, path, name, desc, extra=None, trail=None):
    node = {"@type": t, "@id": D + path + "#page", "url": D + path, "name": name,
            "description": desc, "isPartOf": SITE, "inLanguage": "en-US"}
    if trail: node["breadcrumb"] = {"@id": D + path + "#breadcrumb"}
    node.update(extra or {})
    g = [node]
    if trail: g.append(crumbs(path, *trail))
    return {"@context": CTX, "@graph": g}

pages = {
 "home": {"@context": CTX, "@graph": [
   {"@type": "WebSite", "@id": D + "/#website", "url": D + "/", "name": "Angelino Barajas",
    "description": "Webflow designer and developer: interactive 3D, CMS-driven sites and motion.",
    "inLanguage": "en-US", "publisher": PERSON},
   {"@type": "Person", "@id": D + "/#person", "name": "Angelino Barajas", "url": D + "/",
    "jobTitle": "Webflow designer and developer",
    "description": "Self-taught designer and developer with a philosophy degree, building Webflow sites with interactive 3D, CMS-driven content and motion.",
    "knowsAbout": ["Webflow development", "Interactive 3D", "WebGL", "Motion design", "GSAP",
                   "Brand identity", "CMS integrations", "Design systems", "Web performance"],
    "makesOffer": [{"@type": "Offer", "itemOffered": {"@id": D + "/services/" + s + "#service"}} for s in SERVICES],
    "email": "mailto:angelino@barajasdsgn.com",
    "mainEntityOfPage": {"@id": D + "/about#page"}},
   {"@type": "WebPage", "@id": D + "/#page", "url": D + "/", "name": "Angelino Barajas · Webflow designer + developer",
    "isPartOf": SITE, "about": PERSON, "inLanguage": "en-US"}]},
 "work": page("CollectionPage", "/work", "Mission archive",
   "Webflow sites, brand identities and interactive 3D, each planned, designed in Figma and built from the ground up.",
   {"author": PERSON}, [("Work", None)]),
 "services": page("CollectionPage", "/services", "Services · Launch control",
   "Eight services from one designer-developer: Webflow builds, interactive 3D + data, motion, brand identity, custom code, CMS integrations, design systems and performance.",
   {"provider": PERSON, "hasPart": [{"@id": D + "/services/" + s + "#service"} for s in SERVICES]}, [("Services", None)]),
 "process": page("WebPage", "/process", "Process · The flight plan",
   "Six stages from discovery call to launch, re-plotted for each kind of project.",
   {"about": PERSON}, [("Process", None)]),
 "about": page("ProfilePage", "/about", "About Angelino Barajas",
   "Self-taught designer and developer with a philosophy degree and a soft spot for space.",
   {"mainEntity": PERSON}, [("About", None)]),
 "contact": page("ContactPage", "/contact", "Contact · Open a channel",
   "Questions, help with an existing site, collaborations, hiring or a call.",
   {"about": PERSON}, [("Contact", None)]),
}
# Home FAQ (Pre-flight checks) as FAQPage, from the FAQ seed (Homepage scope, CMS sort order). Any answer still holding a
# [placeholder] keeps the whole block out, so a draft never ships as structured data.
FAQ = sorted((f for f in json.loads((pathlib.Path(__file__).parent.parent / "cms" / "seed" / "faq.json").read_text(encoding="utf-8"))
              if f.get("scope") == "Homepage"), key=lambda f: f.get("sort", 0))
if FAQ and not any("[" in f["answer"] for f in FAQ):
    pages["home"]["@graph"].append({"@type": "FAQPage", "@id": D + "/#faq", "isPartOf": {"@id": D + "/#page"},
        "mainEntity": [{"@type": "Question", "name": f["name"], "acceptedAnswer": {"@type": "Answer", "text": f["answer"]}} for f in FAQ]})

for k, v in pages.items():
    (OUT / (k + ".json")).write_text(json.dumps(v, indent=1, ensure_ascii=False), encoding="utf-8")

# CMS templates: [Field] markers are inserted as field tokens in the Designer (+ Add field).
mission = {"@context": CTX, "@graph": [
  {"@type": "CreativeWork", "@id": D + "/work/[Slug]#work", "url": D + "/work/[Slug]", "name": "[Name]",
   "description": "[Meta description]", "image": "[Social image]", "dateCreated": "[Year]",
   "creator": PERSON, "isPartOf": {"@id": D + "/work#page"}, "inLanguage": "en-US"},
  crumbs("/work/[Slug]", ("Work", D + "/work"), ("[Name]", None))]}
service = {"@context": CTX, "@graph": [
  {"@type": "Service", "@id": D + "/services/[Slug]#service", "url": D + "/services/[Slug]", "name": "[Name]",
   "description": "[Summary]", "serviceType": "[Name]", "audience": {"@type": "Audience", "audienceType": "[Best for]"},
   "provider": PERSON, "isPartOf": {"@id": D + "/services#page"}},
  crumbs("/services/[Slug]", ("Services", D + "/services"), ("[Name]", None))]}
for k, v in (("mission-template", mission), ("services-template", service)):
    body = json.dumps(v, ensure_ascii=False, separators=(",", ":"))
    (OUT / (k + ".head.html")).write_text('<script type="application/ld+json">' + body + "</script>\n", encoding="utf-8")

for f in sorted(OUT.glob("*.json")): json.loads(f.read_text(encoding="utf-8"))
print("ok", [f.name for f in sorted(OUT.iterdir()) if f.is_file()])
