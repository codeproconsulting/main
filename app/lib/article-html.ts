import sanitizeHtml from "sanitize-html";
export function safeArticle(html: string) {
 return sanitizeHtml(html, { allowedTags: [...sanitizeHtml.defaults.allowedTags,"img","figure","figcaption","h1","h2","span"], allowedAttributes: { a:["href","title","target","rel"],img:["src","srcset","sizes","alt","title","width","height","loading"],"*": ["id"],td:["colspan","rowspan"],th:["colspan","rowspan"] }, allowedSchemes:["https","http","mailto","tel"], transformTags:{ a:(_tag,attribs)=>({tagName:"a",attribs:{...attribs,rel:"noopener noreferrer"}}) } });
}
export function hasArticleContent(html: string) {
  return /<img\b[^>]*\bsrc=/i.test(html) || Boolean(html.replace(/<[^>]*>/g, "").replace(/&(?:nbsp|#160|#x0*a0);/gi, " ").trim());
}
