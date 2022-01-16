import axios from 'axios';
import { useState, useEffect } from 'react';

export default function useBookSearch(query, pageNumber) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [books, setBooks] = useState([]);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setBooks([]);
	}, [query]);

	useEffect(() => {
		setLoading(true);
		setError(false);
		let cancel;
		axios({
			method: 'GET',
			url: `http://openlibrary.org/search.json`,
			params: { q: query, page: pageNumber },
			cancelToken: new axios.CancelToken(c => (cancel = c)),
		})
			.then(res => {
				setBooks(prevBooks => {
					return [...new Set([...prevBooks, ...res.data.docs])];
				});
				setHasMore(res.data.docs.length > 0);
				setLoading(false);
				console.log(res);
			})
			.catch(err => {
				if (axios.isCancel(err)) {
					return;
				} else {
					setError(true);
					console.log(err);
				}
			});
		return () => cancel();
	}, [query, pageNumber]);

	return { loading, error, books, hasMore };
}
