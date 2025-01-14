import Express from "express";

const router = Express.Router()

router.get('/theater-details')

router.post('/create-theater')

router.patch("/update-theater")

router.delete('/delete-theater')

export default router;
