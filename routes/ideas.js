const express = require('express')
const router = express.Router()
const Idea = require('../models/Idea')


// get all ideas
router.get('/', async (req, res) => {  
  try {
    const ideas = await Idea.find()
  res.json({ success: true, data: ideas })

  } catch (error) {
    console.log(error)

    res.status(500).json({success: false, error: 'Something went wrong'})
  }
})

// get 1 idea
router.get('/:id', async (req, res) => {  
  
  try {
    const idea = await Idea.findById(req.params.id)

    res.json({ success: true, data: idea })

  } catch (error) {

    console.log(error)

    res.status(500).json({ success: false, error: 'Something went Wrong' })
    
  }
})

// add an idea

router.post('/', async (req, res) => {
  const idea = new Idea ({
    
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  })

  try {
    const saveIdea = await idea.save()

    res.json({ success: true, data: saveIdea })

  } catch (error) {
    console.log(error)
  res.status(500).json({ success: false, error: 'Something went Wrong' })
    
  }

})

// udpate idea

router.put('/:id', async (req, res) => {  
  try {
    const idea = await Idea.findById(req.params.id)
    if (idea.username === req.body.username) {
    
    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id, 
      {
        $set: {
          text: req.body.text,
          tag: req.body.tag,

        }
      },
      {new: true}
    )

    return res.json({ success: true, data: updatedIdea })
    }

    
    res.status(403).json({ success: false, error: 'You are not authorize to update this resource' })

    // username does not match
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: 'Something went Wrong' })
  }
})
// delete idea

router.delete('/:id', async (req, res) => {  
  try {
    const idea = await Idea.findById(req.params.id)

    // match the usernames

    if (idea.username === req.body.username) {
      await Idea.findByIdAndDelete(
        req.params.id
      )
      return res.json({ success: true, data: {} })
    }

    // do not match
    
    res.status(403).json({ success: false, error: 'You are not authorize to delete this resource' })

  
  } catch (error) {
    console.log(error)
    
    res.status(500).json({ success: false, error: 'Something went Wrong' })
  }
})

module.exports = router