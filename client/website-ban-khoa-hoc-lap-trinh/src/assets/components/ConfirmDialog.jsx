export default function ConfirmDialog({ handleClick, ref, text }) {
  return (
    <>
      <dialog ref={ref}>
        <h3>Thông báo xác nhận</h3>
        <p>{text}</p>
        <button onClick={handleClick}>Xác nhận</button>
        <button
          onClick={() => {
            ref?.current?.close();
          }}
        >
          Hủy
        </button>
      </dialog>
    </>
  );
}
