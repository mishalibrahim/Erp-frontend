import React from "react";
import {
  FormProvider as RHFProvider,
  type UseFormReturn,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";

interface FormProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit?: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  methods,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={onSubmit ? methods.handleSubmit(onSubmit) : undefined} className={className}>
        {children}
      </form>
    </RHFProvider>
  );
}
