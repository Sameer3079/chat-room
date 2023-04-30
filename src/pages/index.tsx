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
import { Fragment, useEffect, useRef } from 'react';

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
  const messageTextRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  // const observerRef = useRef<any>(null);

  const utils = trpc.useContext();
  const messagesQuery = trpc.msg.list.useInfiniteQuery(
    {
      limit: 45,
      sortBy: 'createdAt',
      sortOrder: 'asc',
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const sendMessage = trpc.msg.add.useMutation({
    async onSuccess(res) {
      // re-fetches messages after a message is sent
      console.log(res);
      // messagesQuery.data?.push({ ...res, createdAt: new Date() });
      await utils.msg.list.invalidate();
    },
    onError(error) {
      console.log(error);
    },
  });

  /**
   * Executed on 'Enter' keyup or 'Send' button click.
   */
  async function sendMessageHandler(): Promise<void> {
    if (!messageTextRef || !messageTextRef.current) {
      console.error('messageTextRef is null');
      return;
    }
    const messageContent = messageTextRef.current.value;
    if (messageContent.trim().length > 0) {
      await sendMessage.mutateAsync({
        content: messageContent,
        imageUrl: undefined,
      });
      messageTextRef.current.value = '';
    }
  }

  const deleteMessage = trpc.msg.delete.useMutation({
    async onSuccess(res) {
      console.log(res);
      await utils.msg.list.invalidate();
    },
  });

  async function onDeleteMessageClick(messageId: string): Promise<void> {
    await deleteMessage.mutateAsync(messageId);
  }

  // Scroll to bottom of the chat in the beginning
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(
        0,
        messageContainerRef.current.scrollHeight,
      );
    }
  });

  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     const [entry] = entries;
  //     if (entry?.isIntersecting && !messagesQuery.isLoading) {
  //       messagesQuery.fetchNextPage();
  //     }
  //   });

  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);
  //   }

  //   return () => observer.disconnect();
  // }, [messagesQuery, messagesQuery.isLoading]);

  // useEffect(() => {
  //   if (!messagesQuery.isLoading) return;

  //   messagesQuery.fetchNextPage();
  // }, [messagesQuery, messagesQuery.isLoading]);

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

      <div className="main-content">
        {/* Top controls */}
        <Container className="control-card">
          {/* Note: Commented out because this issue exists https://github.com/mantinedev/mantine/issues/2880 */}
          {/* <Select
          placeholder="Sort order"
          data={[{ value: 'sort-by-time', label: 'Sort by Time' }]}
        /> */}
          <Button ml="auto" variant="subtle">
            Asc ⬇️
          </Button>
          <Button ml="xs" variant="subtle">
            Desc ⬆️
          </Button>
        </Container>

        {/* Scrollable messages container */}
        <Container
          ref={messageContainerRef}
          w="100%"
          style={{ maxHeight: '60vh', overflowY: 'scroll' }}
        >
          {messagesQuery.data?.pages?.map((page, index) => (
            <Fragment key={'message-page-' + index}>
              {page.items?.map((message) => (
                <Card
                  className="message-card"
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
                    {getFormattedDate(message.createdAt)}
                  </Text>
                  <Button
                    className="remove-btn"
                    color="red"
                    variant="light"
                    size="xs"
                    onClick={() => onDeleteMessageClick(message.id)}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </Fragment>
          ))}
          <Skeleton height={50} radius="md" animate={true} />
        </Container>
        <div
          style={{
            width: '100%',
          }}
        ></div>

        {/* Bottom controls */}
        <Container className="control-card">
          <TextInput
            placeholder="Your message"
            w="100%"
            ref={messageTextRef}
            onKeyUp={(e) => {
              if (e.key === 'Enter') sendMessageHandler();
            }}
          />
          <Button ml="xs">Attach 🖼️</Button>
          <Button ml="xs" onClick={sendMessageHandler}>
            Send 🚀
          </Button>
        </Container>
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
