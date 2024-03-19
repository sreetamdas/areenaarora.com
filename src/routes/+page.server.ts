import type { PageServerLoad } from "./$types";
import cheerio from "cheerio";

export const load = (async () => {
	const headers = new Headers();
	headers.set(
		"User-Agent",
		"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
	);

	const parsed_articles_content = await Promise.all(
		articles.map(async (article) => {
			const { url } = article;

			const response = await fetch(url, {
				method: "GET",
				headers: headers,
			});

			const page_html = await response.text();
			const page_doc = cheerio.load(page_html);

			const title = page_doc('meta[property="og:title"]').attr("content");
			const description = page_doc('meta[property="og:description"]').attr("content");
			const image = page_doc('meta[property="og:image"]').attr("content");

			return {
				title,
				description,
				image,
			};
		}),
	);

	return { parsed_articles_content };
}) satisfies PageServerLoad;

const articles = [
	{
		url: "https://www.knoxnews.com/story/news/education/2024/03/18/knox-county-schools-announces-half-day-solar-eclipse-2024/73022092007/",
	},
	{
		url: "https://www.knoxnews.com/story/news/education/2024/03/08/farragut-high-school-students-can-soon-take-offsite-christian-class/72881639007/",
	},
	{
		url: "https://www.knoxnews.com/story/news/education/2024/03/05/knox-county-schools-will-ask-board-to-increase-salaries-in-2024/72844947007/",
	},
	{
		url: "https://www.knoxnews.com/story/money/columnists/cathy-ackermann/2024/03/15/cathy-ackermann-when-is-competition-in-business-good/72965474007/",
	},
];
