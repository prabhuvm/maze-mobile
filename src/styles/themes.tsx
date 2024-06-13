
export type ThemeType = {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };

    export const darkTheme: ThemeType = {  // Not using this currently
    primary: '#bb86fc',    // Buttons, components
    secondary: '#03dac6',  // Buttons - secondary
    background: '#121212', // Background - NOT USED MOSTLY
    text: '#ffffff'  // Text
  };

  export const lightTheme: ThemeType = {
    primary: '#EAE7DD',
    secondary: '#EAE7DD',
    background: '#EAE7DD',
    text: '#000000'
  };

  export const yellowTheme: ThemeType = {
    primary: '#FFD700',
    secondary: '#FFD700',
    background: '#FFD700',
    text: '#000000'
  }

  export const crimsonTheme: ThemeType = {
    primary: '#97BC62',
    secondary: '#97BC62',
    background: '#97BC62',
    text: '#000000'
  }

  export const tealTheme: ThemeType = {
    primary: '#A7BEAE',
    secondary: '#A7BEAE',
    background: '#A7BEAE',
    text: '#000000'
  }

  export const themes = {
    light: lightTheme,
    dark: darkTheme,
    yellow: yellowTheme,
    crimson: crimsonTheme,
    teal: tealTheme,
  };