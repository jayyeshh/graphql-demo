import { GraphQLServer } from 'graphql-yoga';

const users=[
    {
        id: '1',
        name: 'Andrew',
        email: 'andrew@mail.co',
    },
    {
        id: '2',
        name: 'Behance',
        email: 'behance@mail.it',
        age: 32,
    },
    {
        id: '3',
        name: 'felix',
        email: 'pewdiepie@gmail.com',
        age: 34,
    }
]

const comments=[
    {
        id: 'c101',
        text: 'comment1',
        author: '3',
        post: '101'
    },
    {
        id: 'c102',
        text: 'comment2',
        author: '3',
        post: '102'
    },
    {
        id: 'c103',
        text: 'comment3',
        author: '3',
        post: '101'
    }
]

const posts=[
    {
        id: '101',
        title: 'post1',
        body: 'post1 body',
        published: false,
        author: '1',
        comments: ['c101', 'c103']
    },
    {
        id: '102',
        title: 'post2',
        body: 'post2 body',
        published: true,
        author: '2',
        comments: ['c102']
    },
    {
        id: '103',
        title: 'title',
        body: 'body',
        published: true,
        author: '1',
        comments: []
    }
]

const typeDefs=`
    type Query {
        greetings(name: String): String!
        me: User!
        post: Post!
        add(num1: Float!, num2: Float!): Float!
        getNums: [Int!]!
        addArr(nums: [Float!]!): Float!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment{
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

const resolvers={
    Query: {
        me(){
            return {
                id: '22432',
                name: 'Jayesh',
                email: 'sjay05305@gmail.com'
            }
        },
        post(){
            return {
                id: '101',
                title: 'post title',
                body: 'post body',
                published: true
            }
        },
        greetings(_1, args, _2, _3){  //parent, args, ctx, info
            if(args.name) return `Hello ${args.name}`
            return `Hey there!`
        },
        add(_1,args, _2, _3){
            return args.num1+args.num2
        },
        addArr(_1, args, _2, _3){
            if(!args.nums.length) return 0;
            return args.nums.reduce((acc,curr)=> acc+curr);
        },
        getNums(){
            return [23, 43, 5]
        },
        users(_1, args, _2, _3){
            if(args.query){
                return users.filter(user=> user.name.toLowerCase().includes(args.query.toLowerCase()));
            }
            return users;
        },
        posts(_1, args, _2, _3){
            if(args.query){
                return posts.filter(post=> post.body.includes(args.query.toLowerCase()));
            }
            return posts;
        },
        comments(){
            return comments
        }
    },
    Post: {
        author(parent, _2, _3, _4){
            return users.find(user=> user.id===parent.author)
        },
        comments(parent, _2, _3, _4){
            console.log(parent);
            return comments.filter(comment=> comment.post===parent.id);
        }
    },
    User: {
        posts(parent, _2, _3, _4){
            return posts.filter(post=> post.author===parent.id);
        },
        comments(parent, _2, _3, _4){
            return comments.filter(comment=> comment.author===parent.id);
        }
    },
    Comment: {
        author(parent, _2, _3, _4){
            return users.find(user=> user.id===parent.author);
        },
        post(parent, _2, _3, _4){
            return posts.find(post=> post.id===parent.post);
        }
    }
}

const server=new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(()=>{
    console.log('The server is up!');
})

/*
supported query so far: 
query{
  posts{
    title
    author{
      name
    }
    comments{
      text
      author{
        name
      }
    }
  }
}
*/