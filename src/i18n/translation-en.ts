export default {
  common: {
    cancel: 'Cancel',
    save: 'Save',
  },
  wallets: {
    name_one: 'Wallet',
    name_other: 'Wallets',

    props: {
      name: {
        label: 'Name',
        placeholder: 'Cash, Family, Savings, ...',
        errors: {
          alreadyExists: 'Already exists',
        },
      },
      currency: {
        label: 'Currency',
      },
    },

    newForm: {
      title: 'New wallet',
      name: {
        placeholder: 'Cash, Family, Savings, ...',
        errors: {
          alreadyExists: 'Already exists',
        },
      },
    },
  },
  categories: {
    name_one: 'Category',
    name_other: 'Categories',
    props: {
      name: {
        errors: {
          alreadyExists: 'Already exists',
        },
      },
      parent: {
        errors: {
          notFound: 'Not found',
        },
      },
    },
  },
  transactions: {
    name_one: 'Transaction',
    name_other: 'Transactions',
  }
}

export const valibot = {}
