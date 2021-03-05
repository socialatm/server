// put the complete path to your project directory here. No slash at the end.
__basedir = `C:/Users/raype/Documents/GitHub/server`;
const assert = require('assert');
const Comment = require(`${__basedir}/api/comment/model/comment.js`);
const User = require(`${__basedir}/api/user/model/user.js`);

describe('Testing CRUD operations for comment model', () => {
    let comment, user;
    beforeEach((done) => {
        user = new User({
            name: {
                firstName: 'Joe',
                lastName: 'Kunz'
            },
            age: '27',
            password: 'test123',
            address: {
                zip: '12053',
                city: 'Berlin',
                street: 'Herrmannstrasse',
                streetNumber: 222,
                country: 'Deutschland'
            },
            username: 'joe',
            contact: {
                email: 'test123@gmx.de',
                phone: 11234567
            }
        });
        user.save()
            .then(() => {
                comment = new Comment({
                    content: 'test content 123',
                    author: user
                });
                comment.save()
                    .then(() => {
                        done();
                    });
            });
    });

    it('saves a comment', () => {
        assert(!comment.isNew);
    });

    it('reads a comment from DB', (done) => {
        Comment.findById(comment._id)
            .then((data) => {
                assert(data.author.toString() === user._id.toString());
                done();
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('updates a comment', (done) => {
        comment.content = 'new content';
        comment.save()
            .then(() => {
                Comment.findById(comment._id)
                    .then((data) => {
                        assert(data.content === 'new content');
                        done();
                    })
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('removes a comment from DB', (done) => {
        comment.remove()
            .then(() => {
                return Comment.findById(comment._id);
            })
            .then((data) => {
                assert(data === null);
                done();
            })
            .catch((err) => {
                console.log(err)
            });
    });
});
