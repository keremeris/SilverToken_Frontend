export default function Modal({ children }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity  z-10">
        <div className="p-1   -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 absolute w-80  flex flex-col bg-linearWhite  items-center justify-center m-auto rounded-3xl">
          <div className=""> {children} </div>
        </div>
      </div>
    </>
  );
}
