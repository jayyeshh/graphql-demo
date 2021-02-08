import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

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
        users(_1, args, { db }, _3){
            if(args.query){
                return db.users.filter(user=> user.name.toLowerCase().includes(args.query.toLowerCase()));
            }
            return db.users;
        },
        posts(_1, args, { db }, _3){
            if(args.query){
                return db.posts.filter(post=> post.body.includes(args.query.toLowerCase()));
            }
            return db.posts;
        },
        comments(_1, _2, { db }, _3){
            return db.comments
        }
    },
    Mutation: {
        createUser(_1, args, { db }, _3){
            const emailExist=db.users.some(user=> user.email===args.email);
            if(emailExist) throw new Error('Email already in use!');
            const user={
                id: uuidv4(),
                ...args.data
            }
            db.users.push(user);
            return user;
        },
        createPost(_1, args, { db }, _3){
            const userExist=db.users.some(user=> user.id===args.author);
            if(!userExist) throw new Error('User Does Not Exist!');
            const post={
                id: uuidv4(),
                ...args.data
            };
            db.posts.push(post);
            return post;
        },
        createComment(_1, args, { db }, _3){
            const userExist=db.users.some(user=> user.id===args.author);
            if(!userExist) throw new Error('Unkown User!');
            const post=db.posts.find(post=> post.id===args.post);
            if(!post || !post.published) throw new Error('Post Does not Exist!');
            const comment={
                id: uuidv4(),
                ...args.data
            };
            post.comments.push(comment);
            return comment;
        },
        deleteUser(_1, args, { db }, _3){
            const userIndex=db.users.findIndex(user=> user.id===args.id);
            if(userIndex===-1) throw new Error('User does not exist!');
            const user=db.users[userIndex];
            db.users.splice(userIndex,1);

            db.posts=db.posts.filter(post=>{
                const match=post.author===args.id;
                if(match){
                    db.comments=db.comments.filter(comment=> comment.post!==post.id);
                }
                return !match;
            });
            db.comments=db.comments.filter(comment=> comment.author!==args.id);
            return user;
        },
        deletePost(_1, args, { db }, _3){
            const postIndex=db.posts.findIndex(post=> post.id===args.id);
            if(postIndex===-1) throw new Error('Cannot find post!');
            const post=db.posts[postIndex];
            db.posts.splice(postIndex,1);
            db.comments=db.comments.filter(cmnt=> cmnt.post!==post.id)
            return post;
        },
        deleteComment(_1, args,{ db }, _3){
            const commentIndex=db.comments.findIndex(cmnt=> cmnt.id===args.id);
            if(commentIndex===-1) throw new Error('Comment does not exist!');
            const comment=db.comments[commentIndex];
            db.comments.splice(commentIndex, 1);
            const postIndex=db.posts.findIndex(post=> post.id===comment.post);
            db.posts[postIndex].comments=db.posts[postIndex].comments.filter(cmnt=> cmnt.id===comment.id);
            return comment;
        }
    },
    Post: {
        author(parent, _2, { db }, _4){
            return db.users.find(user=> user.id===parent.author)
        },
        comments(parent, _2,{ db }, _4){
            return db.comments.filter(comment=> comment.post===parent.id);
        }
    },
    User: {
        posts(parent, _2, { db }, _4){
            return db.posts.filter(post=> post.author===parent.id);
        },
        comments(parent, _2, { db }, _4){
            return db.comments.filter(comment=> comment.author===parent.id);
        }
    },
    Comment: {
        author(parent, _2,{ db }, _4){
            return db.users.find(user=> user.id===parent.author);
        },
        post(parent, _2, { db }, _4){
            return db.posts.find(post=> post.id===parent.post);
        }
    }
}

const server=new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
});

server.start(()=>{
    console.log('The server is up!');
});