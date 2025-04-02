import type { CollectionConfig } from 'payload';
import { lexicalEditor, HeadingFeature, FixedToolbarFeature, InlineToolbarFeature, HorizontalRuleFeature } from '@payloadcms/richtext-lexical';
import { slugField } from '@/fields/slug';
import { generatePreviewPath } from '../utilities/generatePreviewPath';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media', // Ensure this directory exists in your project
    mimeTypes: ['image/*'], // Allow image uploads
  },
  fields: [],
};




export const Works: CollectionConfig<'works'> = {
  slug: 'works',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'mainHeader',
    defaultColumns: ['mainHeader', 'category', 'publishedDate'],
    livePreview: {
      url: ({ data, req }) => {
        return generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'works',
          req,
        });
      },
    },
  },
  fields: [
    {
      name: 'mainHeader',
      type: 'text',
      required: true,
      label: 'Main Header',
    },
    {
      name: 'mainDescription',
      type: 'richText',
      required: true,
      label: 'Main Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'E-commerce', value: 'E-commerce' },
        { label: 'Portfolio', value: 'Portfolio' },
        { label: 'Web App', value: 'Web App' },
        { label: 'Travel', value: 'Travel' },
        { label: 'Art', value: 'Art' },
        { label: 'Finance', value: 'Finance' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      required: true,
      label: 'Project Image',
      relationTo: 'media',
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      label: 'Project Link',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    ...slugField(),
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};

export default Works ; Media;
