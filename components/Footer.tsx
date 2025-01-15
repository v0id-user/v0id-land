import { motion } from "motion/react";

export default function Footer() {
    const isServerRender = typeof window === "undefined";

    return (
        <div className="flex flex-col gap-2 items-center justify-center w-full ">
            {isServerRender ? (
                <footer className="text-center text-sm text-gray-500">
                    جميع الحقوق محفوظة © {new Date().getFullYear()} #V0ID
                </footer>
            ) : (
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 1
                    }}
                    className="text-center text-sm text-gray-500"
                >
                    جميع الحقوق محفوظة © {new Date().getFullYear()} #V0ID
                </motion.footer>
            )}
        </div>
    )
}