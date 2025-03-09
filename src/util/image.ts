// use imported imaged in svelte css
export const toImageUrl 
  = (processedImagePath: string) => 
    `url('${processedImagePath.slice(0).replaceAll('\\', '/')}')`;