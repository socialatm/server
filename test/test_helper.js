const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
  mongoose.connection
    .once('open', () => { 
    	console.log('Good To Go!');
    	done(); 
    })
    .on('error', (error) => {
      console.warn('Warning', error);
    });
});

beforeEach((done) => {	
	const { users, comments, posts, friendships } = mongoose.connection.collections;
  users.drop(() => {	
		comments.drop(() => {	
			posts.drop(() => {	
        friendships.drop(() => {
          done();
        });
			});
		});
	});
});

after((done) => {  
  const { users, comments, posts, friendships } = mongoose.connection.collections;
  users.drop(() => {  
    comments.drop(() => { 
      posts.drop(() => {  
        friendships.drop(() => {
          done();
        });
      });
    });
  });
});
