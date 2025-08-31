import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({ 
      name: 'image', 
      title: 'Image', 
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ 
      name: 'caption', 
      title: 'Caption', 
      type: 'string' 
    }),
  ],
})
