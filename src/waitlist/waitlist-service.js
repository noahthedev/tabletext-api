const WaitlistService = {
  getAllGuests(knex) {
    return knex
      .select('*')
      .from('waitlist')
  },
  getById(knex, id) {
    return knex
      .from('waitlist')
      .select('*')
      .where('id', id)
      .first()
  },
  insertGuest(knex, newGuest) {
    return knex
      .insert(newGuest)
      .into('waitlist')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  deleteGuest(knex, id) {
    return knex('waitlist')
      .where({ id })
      .delete()
  },
  updateRecipe(knex, id, guestMods) {
    return knex('waitlist')
      .where({ id })
      .update(guestMods)
  }

}

module.exports = WaitlistService