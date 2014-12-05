package dao.entity;

/**
 * Created by Daniel on 04.12.2014.
 */
import javax.persistence.*;
@Entity
@Table(name = "REGISTERED_USER")
public class RegisteredUser {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "ID")
    private int registeredUserId;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    @Column(name = "VERSION")
    @Version
    private long version;

    public int getRegisteredUserId() {
        return registeredUserId;
    }

    public void setRegisteredUserId(int registeredUserId) {
        this.registeredUserId = registeredUserId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return "RegisteredUser{" +
                "Id=" + registeredUserId +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RegisteredUser that = (RegisteredUser) o;

        if (registeredUserId != that.registeredUserId) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = registeredUserId;
        result = 31 * result + firstName.hashCode();
        result = 31 * result + lastName.hashCode();
        result = 31 * result + phoneNumber.hashCode();
        return result;
    }
}
