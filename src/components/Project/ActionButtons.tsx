import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ActionButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function ActionButtons({ isSubmitting, onCancel }: ActionButtonsProps) {
  return (
    <div className="bg-white dark:bg-[#151B23] rounded-2xl border border-zinc-200 dark:border-[#3d444d] p-6 sticky bottom-0">
      <div className="flex flex-col-reverse sm:flex-row gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3.5 border border-zinc-300 dark:border-[#3d444d] text-zinc-700 dark:text-neutral-300 rounded-xl hover:bg-zinc-50 dark:hover:bg-[#202830] transition-colors text-sm font-medium"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 px-6 py-3.5 rounded-xl text-white text-sm font-medium transition-colors ${
            isSubmitting
              ? 'bg-zinc-400 dark:bg-neutral-600 cursor-not-allowed'
              : 'bg-black dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-neutral-200'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Cadastrando...
            </span>
          ) : (
            'Cadastrar projeto'
          )}
        </button>
      </div>
    </div>
  );
}   