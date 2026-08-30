import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
const User = mongoose.model('User', new mongoose.Schema({ name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'traveler' } }, { timestamps: true }))
const Booking = mongoose.model('Booking', new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, packageId: String, hotelId: String, paymentStatus: { type: String, default: 'pending' }, bookingDate: { type: Date, default: Date.now } }))
const tokenFor = user => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'development-only-secret', { expiresIn: '7d' })
const auth = (req,res,next) => { try { req.user=jwt.verify(req.headers.authorization?.replace('Bearer ',''), process.env.JWT_SECRET || 'development-only-secret'); next() } catch { res.status(401).json({message:'Authentication required'}) } }
app.get('/api/health', (_,res)=>res.json({status:'ok',service:'Travio API'}))
app.post('/api/auth/register', async (req,res)=>{ try { const {name,email,password}=req.body; if(!name||!email||!password) return res.status(400).json({message:'Name, email and password are required'}); const user=await User.create({name,email,password:await bcrypt.hash(password,12)}); res.status(201).json({token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}}) } catch { res.status(409).json({message:'Email is already registered'}) } })
app.post('/api/auth/login', async (req,res)=>{ const user=await User.findOne({email:req.body.email}); if(!user || !await bcrypt.compare(req.body.password,user.password)) return res.status(401).json({message:'Invalid email or password'}); res.json({token:tokenFor(user),user:{id:user._id,name:user.name,email:user.email,role:user.role}}) })
app.get('/api/bookings', auth, async (req,res)=>res.json(await Booking.find({userId:req.user.id}).sort({bookingDate:-1})))
app.post('/api/bookings', auth, async (req,res)=>res.status(201).json(await Booking.create({...req.body,userId:req.user.id,paymentStatus:'confirmed'})))
const port=process.env.PORT || 5000
if(process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`Travio API running on ${port}`))).catch(err=>console.error('MongoDB connection error:',err.message))
else app.listen(port,()=>console.log(`Travio API running on ${port} (without database; set MONGODB_URI)`))
