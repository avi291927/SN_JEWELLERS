const Toast = ({ toasts }) => {
    if (toasts.length === 0) return null;
    return (
        <>
            {toasts.map((toast, i) => (
                <div key={toast.id} className={`toast toast-${toast.type}`} style={{ top: `${88 + i * 60}px` }}>
                    {toast.message}
                </div>
            ))}
        </>
    );
};

export default Toast;
