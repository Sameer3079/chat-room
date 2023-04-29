import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { CSSProperties, Fragment } from 'react';
import Button from '~/components/Button';
import { Message } from '~/models/message';
import type { AppRouter } from '~/server/routers/_app';

const messagesList: Array<Message> = [
  { attachment: '', content: 'Message 1', id: '12323' },
  { attachment: '', content: 'Message 1', id: '12323' },
  { attachment: '', content: 'Message 1', id: '12323' },
  { attachment: '', content: 'Message 1', id: '12323' },
];
const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <div style={styles}>
      {/**
       * The type is defined and can be autocompleted
       * 💡 Tip: Hover over `data` to see the result type
       * 💡 Tip: CMD+Click (or CTRL+Click) on `text` to go to the server definition
       * 💡 Tip: Secondary click on `text` and "Rename Symbol" to rename it both on the client & server
       */}

      {/* Top controls */}
      <div
        style={{
          minWidth: '30vw',
          maxWidth: '100vh',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            padding: '0.5rem',
            boxShadow: '0 0px 6px rgba(0, 0, 0, 0.25)',
          }}
        >
          <select name="" id="" style={inputStyles}>
            <option value="">Sort by Time</option>
          </select>
          <Button
            name="Asc"
            styles={{ marginLeft: 'auto', marginRight: '0.5rem' }}
          ></Button>
          <Button name="Dsc" styles={{ marginRight: '0.5rem' }}></Button>
        </div>

        {/* Scrollable messages container */}
        <div
          style={{
            width: '100%',
          }}
        >
          {messagesList.map((message) => (
            <div style={{ border: '1px solid red' }} key={message.id}>
              {message.content}
            </div>
          ))}
        </div>

        {/* Bottom controls */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            boxShadow: '0 0px 6px rgba(0, 0, 0, 0.25)',
            marginTop: '1rem',
          }}
        >
          <input type="text" style={inputStyles} />
          <Button
            name="Attach"
            styles={{ marginLeft: 'auto', marginRight: '0.5rem' }}
          ></Button>
          <Button name="Send"></Button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };

const styles: CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
};

const inputStyles: CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: '0.25rem',
  border: '1px solid #1e293b',
};

const messageStyles: CSSProperties = {};
