export const customInputStyles = `
  .no-focus-ring:focus {
    outline: none !important;
    box-shadow: none !important;
    ring: 0 !important;
    ring-offset: 0 !important;
    ring-opacity: 0 !important;
    --tw-ring-color: transparent !important;
    --tw-ring-offset-width: 0px !important;
    --tw-ring-offset-color: transparent !important;
    --tw-ring-offset-shadow: none !important;
    --tw-ring-shadow: none !important;
    border-color: transparent !important;
  }
  
  .no-focus-ring:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
  
  .pink-focus:focus {
    border-color: #f472b6 !important;
  }
  
  button, 
  button:focus, 
  button:active,
  button:focus-visible,
  button:focus-within,
  button[data-state="open"],
  button[data-state="focus"] {
    outline: none !important;
    box-shadow: none !important;
    border: none !important;
    border-color: transparent !important;
    -webkit-tap-highlight-color: transparent !important;
  }
  
  .button-no-border {
    border: none !important;
    outline: none !important;
  }
  
  .button-no-border:focus {
    border: none !important;
    outline: none !important;
  }
  
  form * {
    outline: none !important;
  }
  
  .button-focus:focus {
    background: linear-gradient(to right, #ec4899, #a855f7) !important;
    transform: scale(1.03);
    transition: all 0.2s ease;
  }
`;
