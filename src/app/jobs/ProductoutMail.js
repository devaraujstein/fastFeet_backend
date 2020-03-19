import Mail from '../../lib/Mail';

class ProductoutMail {
  get key() {
    return 'ProductoutMail';
  }

  async handle({ data }) {
    const { name, email, product } = data;

    await Mail.sendEmail({
      to: `${name} <${email}>`,
      subject: 'Novo Produto Disponível para Retirada',
      template: 'product_out',
      context: {
        deliveryman: name,
        product,
      },
    });
  }
}

export default new ProductoutMail();
