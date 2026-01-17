const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // البحث عن المستخدم
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({ error: 'المستخدم غير موجود' });
    }
    
    // التحقق من الحساب المجمد
    if (user.isLocked()) {
      return res.status(423).json({ 
        error: 'الحساب مجمد لمدة 24 ساعة، تواصل مع مشرفك' 
      });
    }
    
    // التحقق من كلمة المرور
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // زيادة محاولات الدخول الفاشلة
      user.loginAttempts += 1;
      
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }
      
      await user.save();
      
      return res.status(401).json({ 
        error: 'كلمة المرور غير صحيحة',
        attemptsLeft: 5 - user.loginAttempts
      });
    }
    
    // إذا نجح الدخول، إعادة تعيين المحاولات
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();
    
    // إنشاء توكن
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role,
        department: user.department 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        department: user.department,
        displayName: user.displayName || user.username
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تسجيل خروج
router.post('/logout', (req, res) => {
  res.json({ message: 'تم تسجيل الخروج بنجاح' });
});

module.exports = router;
