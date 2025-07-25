import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import React from 'react';
import HeaderOne from '../components/HeaderOne';
import ThemeStyle from '../const/ThemeStyle';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={[ThemeStyle.mainContainer]}>
      <View style={[ThemeStyle.mainContainer]}>
        <View style={[ThemeStyle.containerView]}>
          <HeaderOne pageName={'Privacy Policy'} />
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}>
            <Text style={[ThemeStyle.H3, {marginBottom: 10}]}>
              LAST UPDATED: January 26th, 2024
            </Text>
            <Text style={styles.paragraph}>
              This Privacy Policy explains our practices regarding the
              collection, use and disclosure of information that we receive
              through our Services. We use certain capitalized terms in this
              Privacy Policy that are defined in our Terms of Service, so please
              make sure that you have read and understand our Terms of Service
              https://app.fittedcloset.com/terms-of-service. This Privacy Policy
              does not apply to any third-party websites, services or
              applications, even if they are accessible through our Services.
              Also, please note that, unless we define a term in this Privacy
              Policy, all capitalized terms used in this Privacy Policy have the
              same meanings as in our Terms of Service
              https://app.fittedcloset.com/terms-of-service.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>1.</Text> Revisions to this
              Privacy Policy. Any information that is collected via our Services
              is covered by the Privacy Policy in effect at the time such
              information is collected. We may revise this Privacy Policy from
              time to time. If we make any material changes to this Privacy
              Policy, we’ll notify you of those changes by posting them on the
              Services or by sending you an email or other notification, and
              we’ll update the “Last Updated Date” above to indicate when those
              changes will become effective.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>2.</Text> Information
              Collected or Received from You. Our primary goals in collecting
              information are to provide and improve our Services, to administer
              your use of the Services (including your account, if you are an
              account holder), and to enable you to enjoy and easily navigate
              our Services.
              {'\n'}
              <Text style={{fontStyle: 'italic'}}>Account Information.</Text> If
              you create an account, we’ll collect certain information, as
              applicable to the Services, which can be used to identify you,
              such as your name, details of physical appearance (height, weight,
              size), date of birth, clothing items, email address, postal
              address and phone number (“PII”). If you create an account using
              your login credentials from one of your SNS Accounts, we’ll be
              able to access and collect your name and email address and other
              PII subject to your privacy settings on the SNS Account that you
              use. If you create an account through the Site or one of your SNS
              Accounts, we may also collect other information that is not
              considered PII because it cannot be used, by itself, to identify
              you.
              {'\n'}
              <Text style={{fontStyle: 'italic'}}>Information </Text>Collected
              Using Cookies and other Web Technologies. Like many website owners
              and operators, our Site uses automated data collection tools such
              as Cookies and Web Beacons to collect certain data.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              “Cookies” are small text files that are placed on your device by a
              web server when you access our Services. We may use both session
              Cookies and persistent Cookies to identify that you’ve logged in
              to the Services and to tell us how and when you interact with our
              Services. We may also use Cookies to monitor aggregate usage and
              web traffic routing on our Services and to customize and improve
              our Services. Unlike persistent Cookies, session Cookies are
              deleted when you log off from the Services and close your browser.
              Although most browsers automatically accept Cookies, you can
              change your browser options to stop automatically accepting
              Cookies or to prompt you before accepting Cookies. Please note,
              however, that if you don’t accept Cookies, you may not be able to
              access all portions or features of the Services. Some third-party
              services providers that we engage (including third-party
              advertisers) may also place their own Cookies on your device. Note
              that this Privacy Policy covers only our use of Cookies and does
              not include use of Cookies by such third parties.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              “Web Beacons” (also known as web bugs, pixel tags or clear GIFs)
              are tiny graphics with a unique identifier that may be included on
              our Services for several purposes, including to deliver or
              communicate with Cookies, to track and measure the performance of
              our Services, to monitor how many visitors view our Services, and
              to monitor the effectiveness of our advertising. Unlike Cookies,
              which are stored on the device, Web Beacons are typically embedded
              invisibly on web pages (or in an e-mail).
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              “Log Data” means certain information about how a person uses our
              Services, including both account holders and non-account holders
              (either, a “User”). Log Data may include information such as a
              User’s Internet Protocol (IP) address, browser type, operating
              system, the web page that a User was visiting before accessing our
              Services, the pages or features of our Services to which a User
              browsed and the time spent on those pages or features, search
              terms, the links on our Services that a User clicked on and other
              statistics. We use Log Data to administer the Services and we
              analyze (and may engage third parties to analyze) Log Data to
              improve, customize and enhance our Services by expanding their
              features and functionality and tailoring them to our Users’ needs
              and preferences. We may use a person’s IP address to generate
              aggregate, non-identifying information about how our Services are
              used.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{fontStyle: 'italic'}}>
                {' '}
                Information Sent by Your Mobile Device.
              </Text>{' '}
              We collect certain information that your mobile device sends when
              you use our Services, like a device identifier, user settings and
              the operating system of your device, as well as information about
              your use of our Services.
              {'\n'}
              <Text style={{fontStyle: 'italic'}}>
                Location Information.
              </Text>{' '}
              When you use our Apps, we may collect and store information about
              your location by converting your IP address into a rough
              geo-location or by accessing your mobile device’s GPS coordinates
              or coarse location if you enable location services on your We may
              use location information to improve and personalize our Services
              for you. If you do not want us to collect location information,
              you may disable that feature on your mobile device. However, some
              of the Service are only available by using your location.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>3.</Text> Information that
              We Share with Third Parties. We will not share any PII that we
              have collected from or regarding you except as described below:
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{fontStyle: 'italic'}}>
                Information Shared with Our Services Providers.
              </Text>{' '}
              We may engage third-party services providers to work with us to
              administer and provide the Services. These third-party services
              providers have access to your PII only for the purpose of
              performing services on our behalf. We may share your PII with our
              payment processing services providers in order to complete
              transactions that are initiated through the Services. We may also
              share your PII with our marketing service providers to help us
              better market our products and services to you. These marketing
              service providers may use your PII only for the purpose of helping
              us to provide relevant products and services information to you.
              If you don’t want us to use your PII for these marketing purposes,
              you can opt out by contacting us at hello@fittedcloset.com.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{fontStyle: 'italic'}}>
                Information Shared with other Third Parties.
              </Text>{' '}
              We may share anonymized or aggregated data we collect from the use
              of the Services, such as de-identified demographic information,
              de-identified location information, information about the computer
              or device from which you access the Services, market trends and
              other analysis that we create based on the information we receive
              from you and other Users of the Services.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={{fontStyle: 'italic'}}>
                Information Shared with Web Analytics Services Providers.
              </Text>
            </Text>
            <Text style={styles.paragraph}>
              Google. We use Google Analytics, a service provided by Google,
              Inc. (“Google”), to gather information about how Users engage with
              our Site and Services. For more information about Google
              Analytics, please visit
              <Text
                onPress={() =>
                  Linking.openURL(
                    'http://www.google.com/policies/privacy/partners/',
                  )
                }
                style={[styles.FontLink]}>
                {' '}
                www.google.com/policies/privacy/partners/
              </Text>
              . You can opt out of Google’s collection and processing of data
              generated by your use of the Services by going to
              <Text
                onPress={() =>
                  Linking.openURL('http://tools.google.com/dlpage/gaoptout/')
                }
                style={[styles.FontLink]}>
                {' '}
                http://tools.google.com/dlpage/gaoptout
              </Text>
              .
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              Facebook. We may use certain tools offered by Facebook, Inc.
              (“Facebook”) that enable it to collect or receive information
              about actions Users take on: (a) our Site and elsewhere on the
              internet through use of Cookies, Web Beacons and other storage
              technologies; or
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              (b) our Apps and other mobile applications, in order to provide
              measurement services, targeted ads and other services. For more
              information regarding the collection and use of such information
              by Facebook, please see the Facebook
              <Text
                onPress={() =>
                  Linking.openURL('https://www.facebook.com/about/privacy/')
                }
                style={[styles.FontLink]}>
                {' '}
                Data Policy,{' '}
              </Text>
              available at:
              <Text
                onPress={() =>
                  Linking.openURL('https://www.facebook.com/policy.php')
                }
                style={[, styles.FontLink]}>
                {' '}
                https://www.facebook.com/policy.php.
              </Text>
            </Text>
            <Text style={styles.paragraph}>
              Information Disclosed in Connection with Business Transactions.
              Information that we collect from our Users, including PII, is
              considered to be a business asset. Thus, if we are acquired by a
              third party as a result of a transaction such as a merger,
              acquisition or asset sale or if our assets are acquired by a third
              party in the event we go out of business or enter bankruptcy, some
              or all of our assets, including your PII, may be disclosed or
              transferred to a third party acquirer in connection with the
              transaction.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              Information Disclosed for Our Protection and the Protection of
              Others. We cooperate with government and law enforcement officials
              or private parties to enforce and comply with the We may disclose
              any information about you to government or law enforcement
              officials or private parties as we, in our sole discretion,
              believe necessary or appropriate:
            </Text>
            <Text style={styles.paragraph}>
              (i) to respond to claims, legal process (including subpoenas);
              (ii) to protect our property, rights and safety and the property,
              rights and safety of a third party or the public in general; and
              (iii) to stop any activity that we consider illegal, unethical or
              legally actionable activity.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>4.</Text> Your PII. In
              compliance with the California Online Privacy Protection Act and
              the General Data Protection Regulation, we offer you choices
              regarding the collection, use and sharing of your PII and we’ll
              respect the choices you make. Please note that if you decide not
              to provide us with the PII that we request, you may not be able to
              access all of the features of the Services.
            </Text>
            <Text style={styles.paragraph}>
              Opt-Out of our Mailings. We may periodically send you free
              newsletters and e-mails that directly promote our Services. When
              you receive such promotional communications from us, you will have
              the opportunity to “opt-out” (either through your account or by
              following the unsubscribe instructions provided in the e-mail you
              receive). We do need to send you certain communications regarding
              the Services and you will not be able to opt out of those
              communications – g., communications regarding updates to our Terms
              of Service or this Privacy Policy or information about billing.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              Opt-out of Ad Tracking. You can opt out of the collection and use
              of your information for ad targeting by going to
              <Text
                onPress={() =>
                  Linking.openURL('http://www.aboutads.info/choices')
                }
                style={[styles.FontLink]}>
                {' '}
                http://www.aboutads.info/choices{' '}
              </Text>
              or
              <Text
                onPress={() =>
                  Linking.openURL('http://www.youronlinechoices.eu/')
                }
                style={[styles.FontLink]}>
                {' '}
                http://www.youronlinechoices.eu/{' '}
              </Text>
              to limit collection through the Site or by configuring the
              settings on your mobile device to limit ad tracking through the
              Site.
            </Text>
            <Text style={styles.paragraph}>
              {' '}
              Deleting and Reviewing Your Information. If you want to review
              your PII, or if you would like us to delete your PII and your
              account, please contact us at hello@fittedcloset.com with the
              email address that you used to register your account with us.
              We’ll take steps to delete your information as soon we can. Be
              advised that, as permitted and/or required by law, some
              information may remain in archived/backup copies for our records.
            </Text>
            <Text style={styles.paragraph}>
              Obtaining a Copy of Your Information. If you want a copy of your
              information that we have stored from your use of the Services,
              place contact us at hello@fittedcloset.com and we will provide you
              with a copy of that data in a commonly used and machine-readable
              format within thirty days.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>5.</Text> Responding to Do
              Not Track Signals. Our Site does not have the capability to
              respond to “Do Not Track” signals received from various web
              browsers.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>6.</Text> The Security of
              Your Information. We take commercially reasonable administrative,
              physical and electronic measures designed to protect the
              information that we collect from or about you (including your PII)
              from unauthorized access, use or disclosure. Please be aware,
              however, that no method of transmitting information over the
              Internet or storing information is completely secure. Accordingly,
              we cannot guarantee the absolute security of any of your PII or
              other data, and you acknowledge that you assume certain risks by
              participating in our Services.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>7.</Text> Links to Other
              Sites and Third Party Services. Our Services may contain links to
              websites and services that are owned or operated by third parties
              (each, a “Third-party Service”). Any information that you provide
              on or to a Third-party Service or that is collected by a
              Third-party Service is provided directly to the owner or operator
              of the Third-party Service and is subject to the owner’s or
              operator’s privacy policy. We’re not responsible for the content,
              privacy or security practices and policies of any Third-party
              Service To protect your information we recommend that you
              carefully review the privacy policies of all Third-party Services
              that you access.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>8.</Text> International
              Transfer of Information. Your PII may be transferred to, and
              maintained on, computers located outside of your state, province,
              country or other governmental jurisdiction where the privacy laws
              may not be as protective as those in your jurisdiction. If you’re
              located outside the United States and choose to provide your PII
              to us, we may transfer your PII to the United States.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>9.</Text> Our Policy Toward
              Children. Our Services are not directed to children under 13 and
              we do not knowingly collect PII from children under 13. If we
              learn that we have collected PII of a child under 13 we will take
              steps to delete such information from our files as soon as
              possible.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>10.</Text> Your California
              Privacy Rights. In accordance with California law, California
              residents may request and obtain from us, once a year, free of
              charge, a list of third parties, if any, to which we disclosed
              their PII for direct marketing purposes during the preceding
              calendar year and the categories of PII shared with those third
              parties. If you are a California resident and wish to obtain that
              information, please submit your request by sending us an email at
              hello@fittedcloset.com with “California Privacy Rights” in the
              subject line or by writing to us at 2261 MARKET ST NUM 4454 SAN
              FRANCISCO, CA 94114.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={ThemeStyle.FontWeight700}>11.</Text> Questions?
              Please contact us at hello@fittedcloset.com. if you have any
              questions about our Privacy Policy.
            </Text>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingVertical: 20,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'justify',
  },
  FontLink: {
    color: 'blue',
    fontSize: 16,
  },
});
