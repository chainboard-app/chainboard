import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { Tip } from './tip.entity';

describe('Entities', () => {
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
    expect(saved.createdAt).toBeInstanceOf(Date);
  });

  it('should enforce unique githubId', async () => {
    const user1 = userRepo.create({ githubId: 'unique1', username: 'a' });
    await userRepo.save(user1);

    const user2 = userRepo.create({ githubId: 'unique1', username: 'b' });
    await expect(userRepo.save(user2)).rejects.toThrow();
  });

  it('should create a post linked to a user', async () => {
    const user = userRepo.create({ githubId: 'poster1', username: 'poster' });
    const savedUser = await userRepo.save(user);

    const post = postRepo.create({
      content: 'Hello blockchain world',
      chainTag: 'stellar',
      author: savedUser,
    });
    const savedPost = await postRepo.save(post);

    expect(savedPost.id).toBeDefined();
    expect(savedPost.content).toBe('Hello blockchain world');
    expect(savedPost.chainTag).toBe('stellar');
    expect(savedPost.upvotes).toBe(0);
    expect(savedPost.author.id).toBe(savedUser.id);
    expect(savedPost.createdAt).toBeInstanceOf(Date);
  });

  it('should create a tip linked to sender, receiver, and post', async () => {
    const sender = userRepo.create({ githubId: 'sender1', username: 'sender' });
    const receiver = userRepo.create({ githubId: 'receiver1', username: 'receiver' });
    const [savedSender, savedReceiver] = await userRepo.save([sender, receiver]);

    const post = postRepo.create({
      content: 'Great post',
      chainTag: 'ethereum',
      author: savedSender,
    });
    const savedPost = await postRepo.save(post);

    const tip = tipRepo.create({
      amount: 10.5,
      sender: savedSender,
      receiver: savedReceiver,
      post: savedPost,
      txHash: '0xabc123',
    });
    const savedTip = await tipRepo.save(tip);

    expect(savedTip.id).toBeDefined();
    expect(Number(savedTip.amount)).toBeCloseTo(10.5);
    expect(savedTip.sender.id).toBe(savedSender.id);
    expect(savedTip.receiver.id).toBe(savedReceiver.id);
    expect(savedTip.post.id).toBe(savedPost.id);
    expect(savedTip.txHash).toBe('0xabc123');
    expect(savedTip.createdAt).toBeInstanceOf(Date);
  });

  it('should load tips with eager relations', async () => {
    const tips = await tipRepo.find();
    expect(tips.length).toBeGreaterThan(0);
    expect(tips[0].sender).toBeDefined();
    expect(tips[0].receiver).toBeDefined();
    expect(tips[0].post).toBeDefined();
  });
});
