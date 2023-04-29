import {
  Button,
  Card,
  Container,
  Select,
  Skeleton,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const child = <Skeleton height={140} radius="md" animate={true} />;

const getFormattedDate = (date: Date): string => {
  const f = new Intl.DateTimeFormat('en-us', { dateStyle: 'full' });
  return f.format(date);
};

const getTime = (date: Date): string => {
  const f = new Intl.RelativeTimeFormat('en-us', {
    style: 'long',
    numeric: 'auto',
  });
  return f.format(-1, 'minutes');
};

const IndexPage: NextPageWithLayout = () => {
  // const utils = trpc.useContext();
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
  const messagesQuery = trpc.msg.list.useQuery();

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
          marginTop: '1rem',
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
          {/* Note: Commented out because this issue exists https://github.com/mantinedev/mantine/issues/2880 */}
          {/* <Select
            placeholder="Sort order"
            data={[{ value: 'sort-by-time', label: 'Sort by Time' }]}
          /> */}
          <Button ml="auto" variant="subtle">
            Asc ⬇️
          </Button>
          <Button ml="xs" variant="subtle">
            Dsc ⬆️
          </Button>
        </div>

        {/* Scrollable messages container */}
        <Container w="100%">
          {messagesQuery.data &&
            messagesQuery.data.map((message) => (
              <Card
                withBorder
                radius="md"
                key={message.id}
                padding="xs"
                mb="xs"
              >
                <Text fw={400} component="a">
                  {message.content}
                </Text>
                <Text fw={100} size="sm">
                  {getTime(message.createdAt)}
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
