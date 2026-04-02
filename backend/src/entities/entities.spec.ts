import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Tip } from './tip.entity';

let dataSource: DataSource;
let userRepo: Repository<User>;
let postRepo: Repository<Post>;
let tipRepo: Repository<Tip>;

beforeAll(async () => {
  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: ':memory:',
    entities: [User, Post, Tip],
    synchronize: true,
  });
  await dataSource.initialize();
  userRepo = dataSource.getRepository(User);
  postRepo = dataSource.getRepository(Post);
  tipRepo = dataSource.getRepository(Tip);
});

afterAll(async () => {
  await dataSource.destroy();
});

describe('User entity', () => {
  it('should create and retrieve a user', async () => {
    const user = userRepo.create({
      githubId: '12345',
      username: 'testuser',
      avatarUrl: 'https://example.com/avatar.png',
      walletAddress: null,
    });
    const saved = await userRepo.save(user);

    expect(saved.id).toBeDefined();
    expect(saved.githubId).toBe('12345');
    expect(saved.username).toBe('testuser');
    expect(saved.avatarUrl).toBe('https://example.com/avatar.png');
    expect(saved.walletAddress).toBeNull();
    expect(saved.createdAt).toBeDefined();
  });

  it('should enforce unique githubId', async () => {
    const user1 = userRepo.create({ githubId: 'unique1', username: 'u1' });
    await userRepo.save(user1);

    const user2 = userRepo.create({ githubId: 'unique1', username: 'u2' });
    await expect(userRepo.save(user2)).rejects.toThrow();
  });

  it('should allow nullable avatarUrl and walletAddress', async () => {
    const user = userRepo.create({
      githubId: 'nullable-test',
      username: 'nullableuser',
    });
    const saved = await userRepo.save(user);
    expect(saved.avatarUrl).toBeNull();
    expect(saved.walletAddress).toBeNull();
  });
});

describe('Post entity', () => {
  it('should create a post linked to a user', async () => {
    const user = await userRepo.save(
      userRepo.create({ githubId: 'post-author', username: 'author' }),
    );

    const post = postRepo.create({
      content: 'Hello blockchain world!',
      chainTag: 'stellar',
      authorId: user.id,
    });
    const saved = await postRepo.save(post);

    expect(saved.id).toBeDefined();
    expect(saved.content).toBe('Hello blockchain world!');
    expect(saved.chainTag).toBe('stellar');
    expect(saved.upvotes).toBe(0);
    expect(saved.authorId).toBe(user.id);
    expect(saved.createdAt).toBeDefined();
  });

  it('should load post with author relation', async () => {
    const user = await userRepo.save(
      userRepo.create({ githubId: 'rel-author', username: 'relauthor' }),
    );
    await postRepo.save(
      postRepo.create({
        content: 'Relation test',
        chainTag: 'ethereum',
        authorId: user.id,
      }),
    );

    const post = await postRepo.findOne({
      where: { authorId: user.id },
      relations: ['author'],
    });

    expect(post).toBeDefined();
    expect(post!.author).toBeDefined();
    expect(post!.author.id).toBe(user.id);
    expect(post!.author.username).toBe('relauthor');
  });

  it('should default upvotes to 0', async () => {
    const user = await userRepo.save(
      userRepo.create({ githubId: 'upvote-test', username: 'upvoteuser' }),
    );
    const post = await postRepo.save(
      postRepo.create({
        content: 'Upvote default test',
        chainTag: 'stellar',
        authorId: user.id,
      }),
    );
    expect(post.upvotes).toBe(0);
  });
});

describe('Tip entity', () => {
  it('should create a tip with sender, receiver, and post relations', async () => {
    const sender = await userRepo.save(
      userRepo.create({ githubId: 'tip-sender', username: 'sender' }),
    );
    const receiver = await userRepo.save(
      userRepo.create({ githubId: 'tip-receiver', username: 'receiver' }),
    );
    const post = await postRepo.save(
      postRepo.create({
        content: 'Tip target post',
        chainTag: 'stellar',
        authorId: receiver.id,
      }),
    );

    const tip = tipRepo.create({
      amount: 10.5,
      senderId: sender.id,
      receiverId: receiver.id,
      postId: post.id,
      txHash: '0xabc123',
    });
    const saved = await tipRepo.save(tip);

    expect(saved.id).toBeDefined();
    expect(saved.amount).toBe(10.5);
    expect(saved.senderId).toBe(sender.id);
    expect(saved.receiverId).toBe(receiver.id);
    expect(saved.postId).toBe(post.id);
    expect(saved.txHash).toBe('0xabc123');
    expect(saved.createdAt).toBeDefined();
  });

  it('should load tip with all relations', async () => {
    const sender = await userRepo.save(
      userRepo.create({ githubId: 'tip-rel-sender', username: 'relsender' }),
    );
    const receiver = await userRepo.save(
      userRepo.create({
        githubId: 'tip-rel-receiver',
        username: 'relreceiver',
      }),
    );
    const post = await postRepo.save(
      postRepo.create({
        content: 'Tip relation post',
        chainTag: 'ethereum',
        authorId: receiver.id,
      }),
    );
    await tipRepo.save(
      tipRepo.create({
        amount: 5.0,
        senderId: sender.id,
        receiverId: receiver.id,
        postId: post.id,
        txHash: '0xdef456',
      }),
    );

    const tip = await tipRepo.findOne({
      where: { txHash: '0xdef456' },
      relations: ['sender', 'receiver', 'post'],
    });

    expect(tip).toBeDefined();
    expect(tip!.sender.username).toBe('relsender');
    expect(tip!.receiver.username).toBe('relreceiver');
    expect(tip!.post.content).toBe('Tip relation post');
  });
});

describe('User-Post relationship', () => {
  it('should load user with their posts', async () => {
    const user = await userRepo.save(
      userRepo.create({ githubId: 'posts-user', username: 'postsuser' }),
    );
    await postRepo.save(
      postRepo.create({
        content: 'First post',
        chainTag: 'stellar',
        authorId: user.id,
      }),
    );
    await postRepo.save(
      postRepo.create({
        content: 'Second post',
        chainTag: 'ethereum',
        authorId: user.id,
      }),
    );

    const loaded = await userRepo.findOne({
      where: { id: user.id },
      relations: ['posts'],
    });

    expect(loaded).toBeDefined();
    expect(loaded!.posts.length).toBe(2);
  });
});
