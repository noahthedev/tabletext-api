const WaitlistService = {
  getAllGuests(knex) {
    return knex
      .select('*')
      .from('waitlist')
  }
}

module.exports = WaitlistService