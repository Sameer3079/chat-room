import {
  Button,
  Card,
  Container,
  Grid,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { CSSProperties, Fragment } from 'react';
import { Message } from '~/models/message';
import type { AppRouter } from '~/server/routers/_app';

const child = <Skeleton height={140} radius="md" animate={true} />;
const messagesList: Array<Message> = [
  { attachment: '', content: 'Hey Sameer', id: '1' },
  { attachment: '', content: 'Hey Bob', id: '2' },
  { attachment: '', content: 'Message 1', id: '3' },
  { attachment: '', content: 'Message 1', id: '4' },
];
const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();
  // const postsQuery = trpc.post.list.useInfiniteQuery(
  //   {
  //     limit: 5,
  //   },
  //   {
  //     getPreviousPageParam(lastPage) {
  //       return lastPage.nextCursor;
  //     },
  //   },
  // );

  // const addPost = trpc.post.add.useMutation({
  //   async onSuccess() {
  //     // refetches posts after a post is added
  //     await utils.post.list.invalidate();
  //   },
  // });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <Container size="xs">
      {/**
       * The type is defined and can be autocompleted
       * 💡 Tip: Hover over `data` to see the result type
       * 💡 Tip: CMD+Click (or CTRL+Click) on `text` to go to the server definition
       * 💡 Tip: Secondary click on `text` and "Rename Symbol" to rename it both on the client & server
       */}

      {/* <Container my="md">
        <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'xs', cols: 1 }]}>
          <Stack>
            {child}
            {child}
            {child}
          </Stack>
        </SimpleGrid>
      </Container> */}

      <Container style={{ textAlign: 'center' }}>
        <Title order={1}>Chat Room</Title>
        <Text fs="italic">By Sameer Basil</Text>
      </Container>

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
          <Button ml="auto">Asc</Button>
          <Button ml="xs">Dsc</Button>
        </div>

        {/* Scrollable messages container */}
        <Container w="100%">
          {messagesList.map((message) => (
            <Card withBorder radius="md" key={message.id} padding="xs" mb="xs">
              <Text fw={400} component="a">
                {message.content}
              </Text>
            </Card>
          ))}
          <Skeleton height={50} radius="md" animate={true} />
        </Container>
        <div
          style={{
            width: '100%',
          }}
        ></div>

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
          <TextInput placeholder="Your message" w="100%" />
          <Button ml="xs">Attach 🖼️</Button>
          <Button ml="xs">Send 🚀</Button>
        </div>
      </div>
    </Container>
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
  // width: '100vw',
  // height: '100vh',
  // display: 'flex',
  // flexWrap: 'wrap',
  // justifyContent: 'center',
  // alignItems: 'center',
};

const inputStyles: CSSProperties = {
  // padding: '0.5rem 0.75rem',
  // borderRadius: '0.25rem',
  // border: '1px solid #1e293b',
};

const messageStyles: CSSProperties = {};
