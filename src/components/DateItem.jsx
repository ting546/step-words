import Link from "next/link";

const Dateitem =  ({ title, func }) => {
  
  return (
    <>
      <h3 className="uppercase mb-3">
        <p className="pb-2 text-sm">{title}</p>
        <span className="block w-full h-0.5 bg-gray-700"></span>
      </h3>
      <div className="mb-10">
        {func()?.map((word) => (
          <Link
            key={word.id}
            className="hover:border-b-3  hover:border-gray-200 border-b-3 border-transparent mb-4 block bg-gray-700 rounded-lg p-3"
            href={`/module/${word.id}`}>
            <div className="flex gap-2 mb-1 text-sm">
              <p className="font-bold">Термины: {word.words.length}</p>-<p>Автор: {word.author}</p>
            </div>
            <p className="font-bold text-xl">{word.name}</p>
          </Link>
        ))}
      </div>
    </>
  );
};
export default Dateitem;
