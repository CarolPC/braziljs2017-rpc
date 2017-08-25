const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'rpc_queue';

    ch.assertQueue(q, { durable: false });
    ch.prefetch(1);

    console.log(' [x] Awaiting RPC requests');

    ch.consume(q, function reply(msg) {
      const id = parseInt(msg.content.toString(), 10);

      console.log(` [.] ID ${id}`);

      ch.sendToQueue(msg.properties.replyTo,
        new Buffer('name: Ada Lovelace, occupation: programmer'),
        { correlationId: msg.properties.correlationId });

      ch.ack(msg);
    });
  });
});
