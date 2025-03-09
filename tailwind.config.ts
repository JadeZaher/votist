import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors:{
        'votistBlue':"#377D8C"
        ,'knowledge':'#003366'
        ,'charisma':'#80538D'
        ,'votist':'#669999'
        ,'scholar':'#2F5DA2'
        ,'mentor':'#4B0082'
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },

  plugins: [typography, forms, containerQueries,     require('daisyui')  ],
  daisyui: {
    themes: ["light"],
  }
} satisfies Config;
