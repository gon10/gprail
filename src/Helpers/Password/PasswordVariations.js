const variations = {
  suggestions: [
    {
      type: 'digits',
      test: /\d/,
      warning: '',
      suggestion: 'It is a good practice to include at least one number in your password',
    },
    {
      type: 'lower',
      test: /[a-z]/,
      warning: '',
      suggestion: 'It is a good practice to include at least one lowercase letter',
    },
    {
      type: 'upper',
      test: /[A-Z]/,
      warning: '',
      suggestion: 'It is a good practice to include at least one uppercase letter',
    },
    {
      type: 'nonWords',
      test: /\W/,
      warning: '',
      suggestion: 'It is a good practice to include at least one special character',
    },
  ],
  sizes: [
    'large',
    'medium',
    'small'
  ]
}

export default variations