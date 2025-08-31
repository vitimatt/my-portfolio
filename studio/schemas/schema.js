// studio/schemas/photo.js
export default {
    name: 'photo',
    title: 'Photo',
    type: 'document',
    fields: [
      {
        name: 'caption',
        title: 'Caption',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
      },
    ],
  }
  