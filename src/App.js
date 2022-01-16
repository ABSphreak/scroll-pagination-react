import { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

function App() {
	const [query, setQuery] = useState('');
	const [pageNumber, setPageNumber] = useState(1);

	const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

	const observer = useRef();
	const lastBookElementRef = useCallback(
		node => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber(prevPageNumber => prevPageNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);

	const handleSearch = e => {
		setQuery(e.target.value);
		setPageNumber(1);
	};

	return (
		<div className="App">
			<div className="w-full flex items-center justify-center fixed top-0">
				<input
					type="text"
					value={query}
					placeholder="Search"
					onChange={handleSearch}
					className="w-full focus:outline-none shadow-sky-200 focus:shadow-blue-300 py-2 shadow-lg font-thin placeholder:text-sky-300 text-center focus:border-sky-500 text-sky-600 border-b text-5xl border-sky-300"
				/>
			</div>
			<div className="text-center text-lg tracking-tight mt-20">
				{books.map((book, index) => {
					if (books.length === index + 1) {
						return (
							<div key={book.key} ref={lastBookElementRef}>
								{book.title}
							</div>
						);
					}
					return <div key={book.key}>{book.title}</div>;
				})}
			</div>
			{loading && <div className="text-pink-500 text-center text-xl font-semibold">Loading more...</div>}
			{error && <div>Error!</div>}
		</div>
	);
}

export default App;
