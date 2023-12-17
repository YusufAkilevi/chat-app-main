import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchHeader = ({
  setIsOpen,
  setSearchInput,
  handleSearch,
  searchInputError,
}) => {
  return (
    <header className="p-4 font-bold text-gray-700 text-lg border-b flex flex-col gap-2">
      <div className="flex justify-between">
        <h2>Search Users</h2>
        <button onClick={() => setIsOpen(false)} className="">
          <XMarkIcon
            className="block h-6 w-6 text-gray-700"
            aria-hidden="true"
          />
        </button>
      </div>
      <form
        onSubmit={handleSearch}
        className="w-full flex justify-center gap-1"
      >
        <input
          type="text"
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email"
          className="block w-5/6 rounded-md border-0 py-1.5 px-2 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <button
          type="submit"
          className="text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300  rounded-md px-3 py-2 text-sm font-medium"
        >
          <MagnifyingGlassIcon className="block h-6 w-6" aria-hidden="true" />
        </button>
      </form>
      {searchInputError && (
        <p className=" mx-3 text-red-400 text-sm font-medium">
          *Please enter a search input!
        </p>
      )}
    </header>
  );
};
export default SearchHeader;
