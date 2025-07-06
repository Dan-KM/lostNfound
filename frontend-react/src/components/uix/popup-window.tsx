import type { PropsWithChildren } from "react"

type PopupWindowProps = PropsWithChildren & {
    handleCloseWindow : () => void
}

export const PopupWindow = ({ children, handleCloseWindow }: PopupWindowProps) => {
  return (
    <div
        className="fixed inset-0 bg-[#432C81]/30 flex items-center justify-center p-6"
    >
        <div className="bg-[#F8F8FF] rounded-lg p-8 max-w-2xl w-full relative">
            <button
                onClick={handleCloseWindow}
                className="absolute top-4 right-4 text-[#121212] hover:text-[#04A699]"
            >
                &times;
            </button>

            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg max-h-96 overflow-y-auto">
                <div className="p-4 max-w-3xl mx-auto">
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}
