declare module 'react-quill' {
    import * as React from 'react';
  
    export interface QuillProps extends React.HTMLAttributes<HTMLDivElement> {
      value?: string;
      onChange?: (content: string, delta: any, source: string, editor: any) => void;
      theme?: string;
      modules?: any;
      formats?: string[];
    }
  
    const ReactQuill: React.ComponentType<QuillProps>;
    export default ReactQuill;
  }
  