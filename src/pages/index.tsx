import {
  Button,
  Card,
  Container,
  FileInput,
  Skeleton,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const getFormattedDate = (date: Date): string => {
  const f = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  return f.format(date);
};

const IndexPage: NextPageWithLayout = () => {
  const messageTextRef = useRef<HTMLInputElement>(null);
  const messageImageRef = useRef<any>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const { ref, inView } = useInView();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortBy, setSortBy] = useState<'createdAt' | 'content'>('createdAt');

  const utils = trpc.useContext();
  const messagesQuery = trpc.msg.list.useInfiniteQuery(
    {
      limit: 15,
      sortBy: sortBy,
      sortOrder: sortOrder,
    },
    {
      getPreviousPageParam: (lastPage) => lastPage.nextCursor,
      _optimisticResults: 'optimistic',
    },
  );

  const onSortOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    window.setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const onSortByChange = (value: string) => {
    const typeValue = value as 'createdAt' | 'content';
    setSortBy(typeValue);
    scrollToBottom();
  };

  const sendMessage = trpc.msg.add.useMutation({
    onMutate(data) {
      if (!messagesQuery.data) return;
      const lastPage =
        messagesQuery.data.pages[messagesQuery.data.pages.length - 1];
      if (!lastPage) return;
      lastPage.items = [
        ...lastPage.items,
        {
          id: 'no_id_yet',
          content: data.content,
          createdAt: new Date(),
          hasImage: !!data.hasImage,
          imageFileName:
            !!data.hasImage && data.imageFileName ? data.imageFileName : null,
          imageUrl:
            !!data.hasImage && data.imageFileName
              ? `https://chat-room-sameer-basil.s3.amazonaws.com/${data.imageFileName}`
              : null,
        },
      ];
    },
    async onSettled() {
      await utils.msg.list.invalidate();
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

    if (!messageImageRef || !messageImageRef.current) {
      console.error('messageImageRef is null');
      return;
    }

    setIsSendingMessage(true);

    const messageContent = messageTextRef.current.value;
    if (messageContent.trim().length > 0) {
      const signedUrl = await sendMessage.mutateAsync({
        content: messageContent,
        hasImage: !!attachedImage,
        imageFileName: attachedImage ? attachedImage.name : undefined,
        imageFileContentType: attachedImage ? attachedImage.type : undefined,
      });
      if (signedUrl && attachedImage) {
        try {
          const response = await fetch(signedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': attachedImage.type,
            },
            body: attachedImage,
          });
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
      await utils.msg.list.invalidate();
      scrollToBottom();
      messageTextRef.current.value = '';
      setAttachedImage(null);
    }

    setIsSendingMessage(false);
    window.setTimeout(() => {
      messageTextRef.current?.focus();
    }, 100);
  }

  const deleteMessage = trpc.msg.delete.useMutation({
    onMutate(messageId) {
      if (!messagesQuery.data) return;
      const lastPage =
        messagesQuery.data.pages[messagesQuery.data.pages.length - 1];
      if (!lastPage) return;
      messagesQuery.data.pages.forEach(
        (page) =>
          (page.items = page.items.filter((item) => item.id !== messageId)),
      );
    },
    async onSettled() {
      await utils.msg.list.invalidate();
    },
  });

  async function onDeleteMessageClick(messageId: string): Promise<void> {
    await deleteMessage.mutateAsync(messageId);
  }

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo(
        0,
        messageContainerRef.current.scrollHeight,
      );
    }
  };

  // Scroll to bottom of the chat in the beginning
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (inView) {
      messagesQuery.fetchPreviousPage();
    }
  }, [inView, messagesQuery]);

  return (
    <Container size="xs">
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
            data={[{ value: 'createdAt', label: 'Sort by Time' }]}
          /> */}

          <select onChange={(e) => onSortByChange(e.target.value)}>
            <option value="createdAt">Sort by Time</option>
            <option value="content">Sort by Content</option>
          </select>

          <Button
            ml="auto"
            variant="subtle"
            onClick={() => onSortOrderChange('asc')}
            disabled={sortOrder === 'asc'}
          >
            Asc ⬇️
          </Button>
          <Button
            ml="xs"
            variant="subtle"
            onClick={() => onSortOrderChange('desc')}
            disabled={sortOrder === 'desc'}
          >
            Desc ⬆️
          </Button>
        </Container>

        {/* Scrollable messages container */}
        <Container ref={messageContainerRef} className="messages-container">
          <div className="load-previous-messages-btn-container">
            <Button
              ref={ref}
              onClick={() => messagesQuery.fetchPreviousPage()}
              disabled={
                !messagesQuery.hasPreviousPage ||
                messagesQuery.isFetchingPreviousPage
              }
              mb="1rem"
            >
              Load previous messages
            </Button>
          </div>
          <Text style={{ textAlign: 'center' }} pb="0.5rem" size="sm">
            {messagesQuery.isFetchingPreviousPage
              ? 'Loading more...'
              : messagesQuery.hasPreviousPage
              ? 'Load Newer'
              : 'Nothing more to load'}
          </Text>

          {/* Messages list */}
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
                  <Container w="100%" m="0" p="0">
                    {message.hasImage && message.imageUrl ? (
                      <img
                        className="message-image"
                        src={message.imageUrl}
                        alt=""
                      />
                    ) : null}
                  </Container>
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

          {/* Skeleton messages to improve loading experience */}
          {messagesQuery.isFetching
            ? new Array(10)
                .fill(1, 0)
                .map((_, index) => (
                  <Skeleton
                    key={'skeleton-message-' + index}
                    height={60}
                    mb="xs"
                    radius="md"
                    animate={true}
                  ></Skeleton>
                ))
            : null}
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
            disabled={isSendingMessage}
            autoFocus={true}
          />
          <FileInput
            ml="xs"
            placeholder="Image"
            icon="🖼️"
            style={{ maxWidth: '5rem' }}
            accept="image/png,image/jpeg"
            onChange={(file) => setAttachedImage(file)}
            ref={messageImageRef}
            disabled={isSendingMessage}
            value={attachedImage}
          />
          <Button
            ml="xs"
            onClick={sendMessageHandler}
            disabled={isSendingMessage}
          >
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
