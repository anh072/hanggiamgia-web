import Home from '../../src/pages/Home/Home';
import DetailedPost from '../../src/pages/DetailedPost/DetailedPost';

export const fetchInitialData = async (PageComponent, ctx) => {
  switch (PageComponent) {
    case Home:
      const query = ctx.request.query;
      let page;
      if (isNaN(query.page)) page = 1;
      else page = parseInt(query.page);
      return Home.fetchData(page);
    case DetailedPost:
      const path = ctx.request.path;
      const id = path.split('/').slice(-1)[0];
      return DetailedPost.fetchData(id);
    default:
      return null;
  }
};