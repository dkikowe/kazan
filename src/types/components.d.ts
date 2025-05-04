declare module '@/components/ui/date-picker' {
  export function DatePicker(props: {
    date?: Date;
    onSelect: (date: Date | undefined) => void;
  }): JSX.Element;
}

declare module '@/components/ui/time-picker' {
  export function TimePicker(props: {
    time?: string;
    onSelect: (time: string) => void;
  }): JSX.Element;
} 