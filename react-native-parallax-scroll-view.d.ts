declare module 'react-native-parallax-scroll-view' {
    import { Component } from 'react';
    import { ViewProps, ScrollViewProps } from 'react-native';
  
    export interface ParallaxScrollViewProps extends ScrollViewProps {
      backgroundColor?: string;
      contentBackgroundColor?: string;
      parallaxHeaderHeight: number;
      stickyHeaderHeight?: number;
      backgroundSpeed?: number;
      renderBackground?: () => React.ReactNode;
      renderForeground?: () => React.ReactNode;
      renderStickyHeader?: () => React.ReactNode;
      renderFixedHeader?: () => React.ReactNode;
      onChangeHeaderVisibility?: (isVisible: boolean) => void;
      headerBackgroundColor?: string;
      fadeOutForeground?: boolean;
      fadeOutBackground?: boolean;
    }
  
    export default class ParallaxScrollView extends Component<ParallaxScrollViewProps> {}
  }
  