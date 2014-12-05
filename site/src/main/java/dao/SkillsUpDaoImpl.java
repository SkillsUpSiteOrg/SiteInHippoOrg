package dao;

import dao.entity.RegisteredUser;
import org.hibernate.SessionFactory;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Daniel on 04.12.2014.
 */
@Repository
public class SkillsUpDaoImpl implements SkillsUpDao {

    @Autowired
    private SessionFactory sessionFactory;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    @Transactional
    public List<RegisteredUser> getRegisteredUsers() {
        return sessionFactory.getCurrentSession().createQuery("from Registered_User").list();
    }
}
