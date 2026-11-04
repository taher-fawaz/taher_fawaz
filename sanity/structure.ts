import type { StructureResolver } from 'sanity/structure'

/** Site settings is a singleton with a fixed ID; everything else is a normal list. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('article').title('Articles'),
      S.documentTypeListItem('series').title('Article series'),
      S.documentTypeListItem('video').title('Videos'),
      S.documentTypeListItem('category').title('Categories'),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('experience').title('Experience'),
    ])
