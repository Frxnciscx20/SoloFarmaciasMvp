"use client"

type AlertSwitchProps = {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export default function AlertSwitch({ checked, onChange, disabled = false }: AlertSwitchProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${checked ? "bg-green-500" : "bg-gray-400 dark:bg-gray-600"}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white transition
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  )
}
