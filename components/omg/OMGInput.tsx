'use client';
import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface OMGInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
}

interface OMGTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

export function OMGInput({ label, error, prefix, className = '', ...rest }: OMGInputProps) {
  return (
    <div className="mb-[14px]">
      {label && (
        <label className="block text-[9px] font-black text-[var(--omg-ink)] uppercase tracking-[1.5px] mb-[7px] font-grotesk">
          {label}
        </label>
      )}
      {prefix ? (
        <div className="flex items-center bg-[var(--omg-card)] border-[3px] border-[var(--omg-ink)] rounded-[20px] overflow-hidden shadow-[4px_4px_0px_var(--omg-ink)]">
          <span className="px-[14px] py-[13px] text-[var(--omg-muted)] font-grotesk text-[13px] font-bold border-l-[2px] border-black/10">
            {prefix}
          </span>
          <input className="flex-1 bg-transparent border-none outline-none px-4 py-[13px] text-[var(--omg-text)] text-[16px] font-cairo" {...rest} />
        </div>
      ) : (
        <input className={`omg-inp ${className}`} {...rest} />
      )}
      {error && <p className="mt-[6px] text-[12px] text-[var(--omg-red)] font-bold">{error}</p>}
    </div>
  );
}

export function OMGTextarea({ label, error, charCount, maxChars, className = '', ...rest }: OMGTextareaProps) {
  return (
    <div className="mb-[14px]">
      {label && (
        <label className="block text-[9px] font-black text-[var(--omg-ink)] uppercase tracking-[1.5px] mb-[7px] font-grotesk">
          {label}
        </label>
      )}
      <textarea className={`omg-inp omg-inp-area ${className}`} {...rest} />
      {(charCount !== undefined && maxChars) && (
        <div className="flex justify-between mt-[6px]">
          <span />
          <span className="text-[12px] text-[var(--omg-muted)] font-grotesk font-bold">{charCount} / {maxChars}</span>
        </div>
      )}
      {error && <p className="mt-[6px] text-[12px] text-[var(--omg-red)] font-bold">{error}</p>}
    </div>
  );
}
